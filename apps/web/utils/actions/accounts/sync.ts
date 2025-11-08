"use server";

/**
 * Account Sync Utility
 *
 * Syncs account metadata from Tinybird to Postgres.
 * Called by Vercel cron job every 5 minutes.
 */

import { db } from "@repo/database";

interface AccountTraitData {
  project_key: string;
  account_id: string;
  account_traits: string | null;
  last_seen: string;
}

interface ParsedAccountTraits {
  name?: string;
  plan?: string;
  mrr?: number;
  lifecycle?: string;
  externalId?: string;
  domains?: string[];
  [key: string]: any;
}

export async function syncAccounts() {
  const startTime = Date.now();
  console.log("[Account Sync] Starting...");

  let synced = 0;
  let errors = 0;

  try {
    const tinybirdUrl = `${process.env.TINYBIRD_BASE_URL}/pipes/latest_account_traits.json?token=${process.env.TINYBIRD_READ_TOKEN}&minutes=10`;

    const response = await fetch(tinybirdUrl);
    if (!response.ok) {
      throw new Error(`Tinybird query failed: ${response.status}`);
    }

    const { data: accounts } = (await response.json()) as {
      data: AccountTraitData[];
    };
    console.log(`[Account Sync] Found ${accounts.length} accounts`);

    for (const account of accounts) {
      try {
        await upsertAccount(account);
        synced++;
      } catch (error) {
        console.error(`[Account Sync] Failed ${account.account_id}:`, error);
        errors++;
      }
    }

    const duration = Date.now() - startTime;
    console.log(
      `[Account Sync] ✅ Done! Synced ${synced}, errors ${errors} (${duration}ms)`,
    );

    return { success: true, synced, errors, duration };
  } catch (error) {
    console.error("[Account Sync] ❌ Fatal error:", error);
    throw error;
  }
}

async function upsertAccount(accountData: AccountTraitData) {
  const { project_key, account_id, account_traits } = accountData;

  // Parse traits
  let traits: ParsedAccountTraits = {};
  if (account_traits) {
    try {
      traits = JSON.parse(account_traits);
    } catch (error) {
      console.warn(`[Account Sync] Bad JSON for ${account_id}`);
    }
  }

  // Get project
  const project = await db.project.findFirst({
    where: { apiKeys: { some: { token: project_key } } },
    select: { id: true, workspaceId: true },
  });

  if (!project) {
    console.warn(`[Account Sync] Project not found: ${project_key}`);
    return;
  }

  const name = traits.name || account_id;

  // Generate unique slug (workspace-scoped)
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const slug = `${project.workspaceId}-${baseSlug}`;

  // Find or create account
  let account = await db.customerAccount.findFirst({
    where: {
      workspaceId: project.workspaceId,
      accountId: account_id,
    },
  });

  if (account) {
    // Update existing
    await db.customerAccount.update({
      where: { id: account.id },
      data: {
        name,
        plan: traits.plan,
        mrr: traits.mrr,
        lifecycle: traits.lifecycle,
        externalId: traits.externalId,
        domains: traits.domains,
      },
    });
  } else {
    // Create new
    await db.customerAccount.create({
      data: {
        workspace: { connect: { id: project.workspaceId } },
        accountId: account_id,
        name,
        slug,
        plan: traits.plan,
        mrr: traits.mrr,
        lifecycle: traits.lifecycle,
        externalId: traits.externalId,
        domains: traits.domains || [],
      },
    });
  }

  // Fetch the customer account ID after upsert
  const customerAccount = await db.customerAccount.findFirst({
    where: {
      workspaceId: project.workspaceId,
      accountId: account_id,
    },
    select: { id: true },
  });

  if (!customerAccount) {
    console.error(
      `[Account Sync] Failed to find account after upsert: ${account_id}`,
    );
    return;
  }

  // Store full traits
  await db.projectAccount.upsert({
    where: {
      projectId_accountId: {
        projectId: project.id,
        accountId: customerAccount.id,
      },
    },
    create: {
      projectId: project.id,
      accountId: customerAccount.id,
      traits,
    },
    update: { traits },
  });
}
