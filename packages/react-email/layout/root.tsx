import { Body, Container, Section, Tailwind } from "@react-email/components";
import { PropsWithChildren } from "react";

import { Footer } from "./footer";
import { Header } from "./header";

export const EmailLayout = ({ children }: PropsWithChildren) => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#18181B",
              muted: "#71717a",
            },
          },
        },
      }}
    >
      <Body className="font-sans my-8">
        <Container className="max-w-[480px]">
          <Header />
          <Section>{children}</Section>
          <Footer />
        </Container>
      </Body>
    </Tailwind>
  );
};
