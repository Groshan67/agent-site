// Pure, filesystem-free helpers + the RadarItem type. Safe to import from
// Client Components. Filesystem-backed data loading lives in lib/radar.ts
// (Server-only — never import that file from a "use client" component).

export type RadarVerdict =
  | "must-watch"
  | "worth-testing"
  | "worth-sharing"
  | "interesting"
  | "skip";

export interface RadarItem {
  slug: string; // also serves as a stable id
  name: string; // card title
  url: string; // also serves as the repository url
  image?: string; // also serves as imageUrl
  tags?: string[];
  verdict?: RadarVerdict;
  take: string; // also serves as the card description
  why: string;
  explanation?: string;
  date: string; // also serves as dateAdded
  author?: string;
  category?: string;
  cloneCommand?: string; // auto-derived from url if omitted
  rating?: number; // 1-5
  status?: string; // e.g. "active", "archived", "trending"
}

/** Returns item.cloneCommand if set, otherwise derives a `git clone` from url. */
export function getCloneCommand(item: RadarItem): string {
  if (item.cloneCommand) return item.cloneCommand;
  const clean = item.url.replace(/\/$/, "");
  return `git clone ${clean}.git`;
}

/**
 * Falls back to GitHub's free OpenGraph image for the repo when no image
 * was supplied. Returns undefined for non-GitHub urls with no image.
 */
export function getRadarImage(item: RadarItem): string | undefined {
  if (item.image) return item.image;
  const match = item.url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/);
  if (!match) return undefined;
  const [, owner, repo] = match;  
  return `https://opengraph.githubassets.com/1/${owner}/${repo}`;
  
}
