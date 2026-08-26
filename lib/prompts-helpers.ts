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
  media?: PromptMedia[]; // 0, 1, or many (X posts can carry up to 4 images)
  tweetUrl?: string;
  author?: string; // X handle, without the @
  tweetId?: string; // used by scripts/fetch-x-prompts.mjs to avoid duplicates
}

/**
 * Every prompt gets a usable image: its own media if it has any, otherwise
 * a stable placeholder from Picsum (free, no key, no signup). Seeded by
 * slug so the same prompt always gets the same placeholder instead of a
 * different random photo on every render.
 */
export function getPromptImage(item: PromptItem): string {
  const own = item.media?.[0]?.url;
  if (own) return own;
  return `https://picsum.photos/seed/${encodeURIComponent(item.slug)}/800/450`;
}

export function getFallbackImage(slug: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(slug)}/800/450`;
}