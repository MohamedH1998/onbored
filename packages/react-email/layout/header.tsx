import { Column, Img, Row, Section } from "@react-email/components";

export const Header = () => {
  return (
    <Section className="mb-4">
      <Row>
        <Column align="left">
          <Img height="28" src="/static/onbored.svg" alt="Onbored" />
        </Column>
      </Row>
    </Section>
  );
};
