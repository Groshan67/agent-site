import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const PROMPTS_DIR = path.join(process.cwd(), "content", "prompts");

export interface PromptItem {
  slug: string;
  title: string;
  tags?: string[];
  sourceUrl?: string;
  date: string;
  body: string;
}

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
    };
  });

  return prompts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPromptBySlug(slug: string): PromptItem | undefined {
  return getAllPrompts().find((p) => p.slug === slug);
}
