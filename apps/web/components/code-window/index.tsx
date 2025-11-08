import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import type { JSX } from "react";

interface CodeWindowProps {
  children: string | JSX.Element;
  onCopy?: () => void;
  label?: string;
  showLineNumbers?: boolean;
  className?: string;
}

const CodeWindow: React.FC<CodeWindowProps> = ({
  children,
  onCopy,
  label,
  showLineNumbers = false,
  className = "",
}) => {
  const lines = typeof children === "string" ? children.split("\n") : [];
  return (
    <div
      className={`w-full bg-[#222222] rounded-lg shadow-lg border border-zinc-800 overflow-hidden font-mono ${className}`}
    >
      {/* Window header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#232326] border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          {label && <span className="ml-4 text-xs text-zinc-400">{label}</span>}
        </div>
        {onCopy && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-primary"
            aria-label="Copy code"
            type="button"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* Code area */}
      <pre className="text-sm leading-relaxed px-4 py-3 overflow-x-auto text-zinc-100 m-0">
        <code className="flex">
          {showLineNumbers && (
            <div className="pr-4 text-zinc-600 select-none text-right">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
          {children}
          <div>
            {lines.map((line, i) => (
              <div key={i}>{line || "\u00A0"}</div>
            ))}
          </div>
        </code>
      </pre>
    </div>
  );
};

export default CodeWindow;
