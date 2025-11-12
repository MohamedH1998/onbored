import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@repo/database";
import { customSession, magicLink } from "better-auth/plugins";
import { sendEmail } from "@/utils/resend";
import { createAuthMiddleware, APIError } from "better-auth/api";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID as string,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    // },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail(email, url);
      },
    }),
    customSession(async ({ user, session }) => {
      const onboardingProgress = await db.onboardingProgress.findUnique({
        where: {
          userId: user.id,
        },
      });
      return {
        onboardingProgress,
        user: {
          ...user,
        },
        session,
      };
    }),
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (!ctx.path.startsWith("/sign-in/magic-link")) {
        return;
      }

      const email = ctx.body?.email;
      if (!email) return;

      const existingUser = await db.user.findUnique({
        where: { email },
      });
      if (existingUser) return;

      const betaModeSetting = await db.appSettings.findUnique({
        where: { key: "betaMode" },
      });

      const betaModeEnabled = betaModeSetting?.value === "true";
      if (!betaModeEnabled) return;

      const invite = await db.invite.findUnique({
        where: { email },
      });

      if (!invite || invite.status !== "APPROVED") {
        throw new APIError("FORBIDDEN", {
          message:
            "Sign up is currently invite-only. Please request an invite.",
        });
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path.startsWith("/sign-in/magic-link") ||
        ctx.path === "/sign-in/social"
      ) {
        const newSession = ctx.context.newSession;
        if (!newSession?.user?.email) return;

        const email = newSession.user.email;

        const userCreatedAt = new Date(newSession.user.createdAt);
        const now = new Date();
        const isNewUser = now.getTime() - userCreatedAt.getTime() < 5000;

        if (!isNewUser) return;

        const betaModeSetting = await db.appSettings.findUnique({
          where: { key: "betaMode" },
        });

        const betaModeEnabled = betaModeSetting?.value === "true";

        if (betaModeEnabled) {
          const invite = await db.invite.findUnique({
            where: { email },
          });

          if (!invite || invite.status !== "APPROVED") {
            try {
              await db.user.delete({
                where: { id: newSession.user.id },
              });
            } catch (err) {
              console.error("Failed to delete unauthorized user:", err);
            }

            throw new APIError("FORBIDDEN", {
              message:
                "Sign up is currently invite-only. Please request an invite.",
            });
          }
        }

        try {
          await db.invite.updateMany({
            where: {
              email,
              status: "APPROVED",
              usedAt: null,
            },
            data: { usedAt: new Date() },
          });
        } catch (err) {
          console.error("Failed to mark invite as used:", err);
        }
      }
    }),
  },
});
