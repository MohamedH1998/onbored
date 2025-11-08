import { Head, Html, Preview, Text } from "@react-email/components";

import { EmailLayout } from "../layout";

type Props = {
  preview: string;
  title: string;
  body: string;
  baseUrl: string;
};

export const DefaultEmail = ({ preview, title, body, baseUrl }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <EmailLayout>
        <Text className="text-2xl">{title}</Text>
        <Text>{body}</Text>
      </EmailLayout>
    </Html>
  );
};

DefaultEmail.PreviewProps = {
  preview: "Preview",
  title: "Title",
  body: "Body",
  baseUrl: "https://example.com",
};

export default DefaultEmail;
