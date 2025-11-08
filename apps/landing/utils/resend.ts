"use server";

import { getResendInstance } from "@/lib/resend";
import { DefaultEmail } from "@repo/email";

export const sendEmail = async (email: string) => {
  try {
    const resend = getResendInstance();

    const { data, error } = await resend.emails.send({
      from: "Mohamed | OnBored <info@admin.onbored.io>",
      to: email,
      subject: "Onbored: Beta waitlist",
      react: DefaultEmail({
        title: "Onbored: Beta waitlist",
        body: "Thanks for showing interest in Onbored. We'll be in touch soon.",
        preview: "Onbored: Beta waitlist",
        baseUrl: "https://onbored.io",
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
    console.error("Send email error:", error);
    throw error;
  }
};
