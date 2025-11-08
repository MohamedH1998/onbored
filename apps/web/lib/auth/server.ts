import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@repo/database";
import { customSession, magicLink } from "better-auth/plugins";
import { sendEmail } from "@/utils/resend";

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
});
