import { Button, Column, Row, Section, Text } from "@react-email/components";

export const Footer = () => {
  return (
    <Section className="mt-4">
      <Row>
        <Column>
          <Text>Preventing churn before it happens</Text>
        </Column>
        <Column align="right">
          <Button
            href={`mailto:info@onbored.com`}
            className="text-sm underline offset-2"
          >
            Support
          </Button>
        </Column>
      </Row>
      <Row>
        <Column>
          <div className="text-xs text-gray-500 leading-relaxed mt-2">
            Onbored • 85 Great Portland Street, London, W1W 7LT
          </div>
        </Column>
      </Row>
      <Row>
        <Column>
          <div className="text-xs text-gray-400 leading-relaxed mt-1">
            You're receiving this because you signed up for Onbored updates.
          </div>
        </Column>
      </Row>
    </Section>
  );
};
