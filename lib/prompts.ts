import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { PromptItem } from "./prompts-helpers";

export type { PromptItem, PromptMedia } from "./prompts-helpers";

const PROMPTS_DIR = path.join(process.cwd(), "content", "prompts");

/** Reads every content/prompts/*.md file (skipping _-prefixed files), newest first. */
export function getAllPrompts(): PromptItem[] {
  if (!fs.existsSync(PROMPTS_DIR)) return [];

  const files = fs
    .readdirSync(PROMPTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  const prompts: PromptItem[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(PROMPTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");

    return {
      slug,
      title: data.title ?? slug,
      tags: data.tags ?? [],
      sourceUrl: data.sourceUrl,
      date: data.date ?? "",
      body: content.trim(),
      // Accept either the current array form or a single old-style object,
      // so nothing written before this change breaks.
      media: Array.isArray(data.media)
        ? data.media
        : data.media
          ? [data.media]
          : undefined,
      tweetUrl: data.tweetUrl,
      author: data.author,
      tweetId: data.tweetId,
    };
  });

  return prompts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPromptBySlug(slug: string): PromptItem | undefined {
  return getAllPrompts().find((p) => p.slug === slug);
}

/** Tweet ids already imported, so the fetch script can skip duplicates. */
export function getKnownTweetIds(): Set<string> {
  return new Set(
    getAllPrompts()
      .map((p) => p.tweetId)
      .filter((id): id is string => Boolean(id)),
  );
}
