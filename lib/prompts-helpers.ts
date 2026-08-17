// Pure types, safe to import from Client Components. The fs-backed loader
// lives in lib/prompts.ts (server-only — never import that into a
// "use client" component, it uses node:fs).

export interface PromptMedia {
  url: string;
  type: "image" | "video";
}

export interface PromptItem {
  slug: string;
  title: string;
  tags?: string[];
  sourceUrl?: string;
  date: string;
  body: string;
  media?: PromptMedia;
  tweetUrl?: string;
  author?: string; // X handle, without the @
  tweetId?: string; // used by scripts/fetch-x-prompts.mjs to avoid duplicates
}
