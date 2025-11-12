"use server";

import { db } from "@repo/database";

export async function submitWaitlistRequest(email: string) {
  try {
    const existing = await db.invite.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.status === "PENDING") {
        return { success: true, message: "Already on waitlist" };
      }
      if (existing.status === "APPROVED") {
        return {
          success: true,
          message: "Already approved - sign in to continue",
        };
      }
      if (existing.status === "REVOKED") {
        return { success: false, error: "Access denied" };
      }
    }

    await db.invite.create({
      data: {
        email,
        status: "PENDING",
        createdById: null,
      },
    });

    return { success: true, message: "Added to waitlist" };
  } catch (err) {
    console.error("Error submitting waitlist request:", err);
    return { success: false, error: "Failed to join waitlist" };
  }
}
