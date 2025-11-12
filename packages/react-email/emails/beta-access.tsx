import { Head, Html, Preview, Text, Button } from "@react-email/components";

import { EmailLayout } from "../layout";

type Props = {
  preview: string;
  title: string;
  body: string;
  buttonText: string;
  buttonUrl: string;
  baseUrl: string;
};

export const BetaAccessEmail = ({
  preview,
  title,
  body,
  buttonText,
  buttonUrl,
  baseUrl,
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <EmailLayout>
        <Text className="text-2xl">{title}</Text>
        <Text>{body}</Text>
        <Button
          href={buttonUrl}
          className="bg-brand text-white px-6 py-3 rounded-md no-underline inline-block cursor-pointer"
        >
          {buttonText}
        </Button>
      </EmailLayout>
    </Html>
  );
};

BetaAccessEmail.PreviewProps = {
  preview: "You've been approved for beta access!",
  title: "Welcome to Onbored Beta",
  body: "Great news - you've been approved for early access.",
  buttonText: "Get Started",
  buttonUrl: "https://app.onbored.io/",
  baseUrl: "https://onbored.io",
};

export default BetaAccessEmail;
