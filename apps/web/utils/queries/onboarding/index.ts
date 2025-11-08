"use server";

import { auth } from "@/lib/auth";
import { db } from "@repo/database";
import { headers } from "next/headers";

export const updateOnboardingProgress = async ({
  userId,
  step,
}: {
  userId: string;
  step: string;
}) => {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error(`User with id ${userId} not found`);
      return {
        success: false,
        error: `User with id ${userId} not found`,
        data: undefined,
      };
    }

    const onboardingProgress = await db.onboardingProgress.upsert({
      where: { userId: userId },
      update: { lastCompletedStep: step },
      create: { userId, lastCompletedStep: step },
    });
    return { success: true, data: onboardingProgress, error: undefined };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message, data: undefined };
  }
};

export const updatePersona = async (
  userId: string,
  role: string,
  goals: string[],
) => {
  try {
    const [persona, onboardingProgress] = await Promise.all([
      db.persona.upsert({
        where: { userId },
        update: {
          role,
          goals: {
            set: [],
            connectOrCreate: goals.map((goal) => ({
              where: { label: goal },
              create: { label: goal },
            })),
          },
        },
        create: {
          userId,
          role,
          goals: {
            connectOrCreate: goals.map((goal) => ({
              where: { label: goal },
              create: { label: goal },
            })),
          },
        },
      }),
      db.onboardingProgress.update({
        where: { userId: userId },
        data: { lastCompletedStep: "about-you" },
      }),
    ]);

    return {
      success: true,
      data: { persona, onboardingProgress },
      error: undefined,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to update persona",
      data: undefined,
    };
  }
};

export const getOnboardingProgress = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized", data: undefined };
    }

    const onboardingProgress = await db.onboardingProgress.findUnique({
      where: { userId: session?.user.id },
    });
    return { success: true, data: onboardingProgress, error: undefined };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to get onboarding progress",
      data: undefined,
    };
  }
};
