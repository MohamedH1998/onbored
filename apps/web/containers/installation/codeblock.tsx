"use client";
import type { JSX } from "react";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { createHighlighter } from "shiki";
import CodeWindow from "@/components/code-window";

type SupportedLang = "typescript" | "bash";

interface Props {
  children: string;
  lang: SupportedLang;
  onCopy?: () => void;
  className?: string;
  label?: string;
}

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      langs: ["typescript", "bash"],
      themes: ["slack-dark"],
    });
  }
  return highlighter;
}

export function CodeBlock({ children, lang, onCopy, className, label }: Props) {
  const [copied, setCopied] = useState(false);

  const [renderedCode, setRenderedCode] = useState<JSX.Element | null>(null);

  useEffect(() => {
    async function renderCode() {
      const hl = await getHighlighter();
      const out = hl.codeToHast(children, {
        lang: lang,
        theme: "slack-dark",
      });

      const result = toJsxRuntime(out, {
        Fragment,
        jsx,
        jsxs,
        components: {
          pre: (props) => <pre data-custom-codeblock {...props} />,
        },
      }) as JSX.Element;

      setRenderedCode(result);
    }

    renderCode();
  }, [children, lang]);

  if (!renderedCode) {
    return (
      <CodeWindow
        label={label}
        onCopy={() => {
          setCopied(true);
          onCopy?.();
          setTimeout(() => setCopied(false), 2000);
        }}
        className={className}
        showLineNumbers={true}
      >
        <pre data-custom-codeblock>
          <code>{children}</code>
        </pre>
      </CodeWindow>
    );
  }

  return (
    <CodeWindow
      label={label}
      onCopy={() => {
        setCopied(true);
        onCopy?.();
        setTimeout(() => setCopied(false), 2000);
      }}
      className={className}
      showLineNumbers={true}
    >
      {renderedCode}
    </CodeWindow>
  );
}
