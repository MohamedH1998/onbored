"use server";

import { db } from "@repo/database";
import { getCurrentUser, isSuperAdmin } from "@/utils/auth-helpers";
import { success, error, type ServerActionResult } from "@/utils/types";
import type { Invite } from "@repo/database";
import { sendBetaAccessEmail } from "@/utils/email/beta-access";

/**
 * Get all invites (admin only)
 */
export async function getInvites(): Promise<
  ServerActionResult<
    Array<Invite & { createdBy: { name: string; email: string } }>
  >
> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) return error("Unauthorized");

    const isAdmin = await isSuperAdmin(userResult.data.id);
    if (!isAdmin) return error("Admin access required");

    const invites = await db.invite.findMany({
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return success(
      invites as Array<Invite & { createdBy: { name: string; email: string } }>
    );
  } catch (err) {
    console.error("Error fetching invites:", err);
    return error("Failed to fetch invites");
  }
}

/**
 * Create new invite (admin only)
 */
export async function createInvite(
  email: string
): Promise<ServerActionResult<Invite>> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) return error("Unauthorized");

    const isAdmin = await isSuperAdmin(userResult.data.id);
    if (!isAdmin) return error("Admin access required");

    // Check if invite already exists
    const existing = await db.invite.findUnique({
      where: { email },
    });

    if (existing) {
      return error("Invite already exists for this email");
    }

    const invite = await db.invite.create({
      data: {
        email,
        status: "APPROVED",
        createdById: userResult.data.id,
      },
    });

    return success(invite);
  } catch (err) {
    console.error("Error creating invite:", err);
    return error("Failed to create invite");
  }
}

/**
 * Approve pending invite (admin only)
 */
export async function approveInvite(
  inviteId: string
): Promise<ServerActionResult<Invite>> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) return error("Unauthorized");

    const isAdmin = await isSuperAdmin(userResult.data.id);
    if (!isAdmin) return error("Admin access required");

    const invite = await db.invite.update({
      where: { id: inviteId },
      data: {
        status: "APPROVED",
        createdById: userResult.data.id,
      },
    });

    try {
      await sendBetaAccessEmail(invite.email);
    } catch (emailErr) {
      console.error("Failed to send beta access email:", emailErr);
    }

    return success(invite);
  } catch (err) {
    console.error("Error approving invite:", err);
    return error("Failed to approve invite");
  }
}

/**
 * Revoke invite (admin only)
 */
export async function revokeInvite(
  inviteId: string
): Promise<ServerActionResult<Invite>> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) return error("Unauthorized");

    const isAdmin = await isSuperAdmin(userResult.data.id);
    if (!isAdmin) return error("Admin access required");

    const invite = await db.invite.update({
      where: { id: inviteId },
      data: { status: "REVOKED" },
    });

    return success(invite);
  } catch (err) {
    console.error("Error revoking invite:", err);
    return error("Failed to revoke invite");
  }
}

/**
 * Get beta mode setting
 */
export async function getBetaMode(): Promise<ServerActionResult<boolean>> {
  try {
    const setting = await db.appSettings.findUnique({
      where: { key: "betaMode" },
    });

    return success(setting?.value === "true");
  } catch (err) {
    console.error("Error fetching beta mode:", err);
    return error("Failed to fetch beta mode");
  }
}

/**
 * Set beta mode (admin only)
 */
export async function setBetaMode(
  enabled: boolean
): Promise<ServerActionResult<boolean>> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) return error("Unauthorized");

    const isAdmin = await isSuperAdmin(userResult.data.id);
    if (!isAdmin) return error("Admin access required");

    await db.appSettings.upsert({
      where: { key: "betaMode" },
      update: { value: enabled.toString() },
      create: { key: "betaMode", value: enabled.toString() },
    });

    return success(enabled);
  } catch (err) {
    console.error("Error setting beta mode:", err);
    return error("Failed to update beta mode");
  }
}

/**
 * Mark invite as used (internal use by auth hook)
 */
export async function markInviteUsed(email: string): Promise<void> {
  try {
    await db.invite.update({
      where: { email },
      data: { usedAt: new Date() },
    });
  } catch (err) {
    console.error("Error marking invite as used:", err);
  }
}
