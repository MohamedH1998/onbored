/**
 * Account Sync API Route
 *
 * GET: Triggered by Vercel Cron every 5 minutes (production)
 * POST: Triggered by ingestion worker after session write (development only)
 *
 * Syncs account data from Tinybird to Postgres.
 */

import { syncAccounts } from "@/utils/actions/accounts/sync";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds max

async function handleSync(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.NODE_ENV === "production") {
    const validSecrets = [
      process.env.CRON_SECRET,
      process.env.SYNC_SECRET,
    ].filter(Boolean);

    const isAuthorized = validSecrets.some(
      (secret) => authHeader === `Bearer ${secret}`,
    );

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await syncAccounts();
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Sync] Failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  return handleSync(request);
}

export async function POST(request: Request) {
  return handleSync(request);
}
