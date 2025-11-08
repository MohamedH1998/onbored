import type { JSX } from "react";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { createHighlighter } from "shiki";

const langs = ["typescript", "bash"] as const;
type SupportedLang = (typeof langs)[number];

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      langs: ["typescript", "bash"],
      themes: ["github-dark"],
    });
  }
  return highlighter;
}

export async function highlight(code: string, lang: SupportedLang) {
  const hl = await getHighlighter();
  const out = hl.codeToHast(code, {
    lang,
    theme: "github-dark",
  });

  return toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs,
  }) as JSX.Element;
}
