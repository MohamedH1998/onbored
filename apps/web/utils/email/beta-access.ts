"use server";

import { getResendInstance } from "@/lib/email/resend";
import { BetaAccessEmail } from "@repo/email";

export const sendBetaAccessEmail = async (email: string) => {
  try {
    const resend = getResendInstance();

    const { data, error } = await resend.emails.send({
      from: "Mohamed | OnBored <info@admin.onbored.io>",
      to: email,
      subject: "Welcome to Onbored Beta!",
      react: BetaAccessEmail({
        preview: "You've been approved for Onbored beta access!",
        title: "Welcome to Onbored Beta!",
        body: "Great news - you've been approved for early access to Onbored. You can now sign in and start using the platform. We're excited to have you as part of our beta community.",
        buttonText: "Get Started",
        buttonUrl: process.env.NEXT_PUBLIC_APP_URL!,
        baseUrl: process.env.NEXT_PUBLIC_APP_URL!,
      }),
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("No response from email service");
    }

    return { data };
  } catch (error) {
    console.error("Send beta access email error:", error);
    throw error;
  }
};
