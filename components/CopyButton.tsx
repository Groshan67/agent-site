"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-md border border-border bg-card px-4 py-2 font-mono text-xs text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? "copied" : "copy prompt"}
    </button>
  );
}
