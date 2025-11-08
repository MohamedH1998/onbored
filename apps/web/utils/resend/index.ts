"use server";

import { getResendInstance } from "@/lib/email/resend";

export const sendEmail = async (email: string, url: string) => {
  try {
    const resend = getResendInstance();
    const { data, error } = await resend.emails.send({
      from: "OnBored <info@admin.onbored.io>",
      to: email,
      subject: "Magic Link",
      html: `Click the link to login into your account: <a href="${url}">${url}</a>`,
    });
    if (error) {
      throw new Error(error.message);
    }

    return { data };
  } catch (error) {
    console.error(error);
  }
};
