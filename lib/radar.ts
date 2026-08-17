import fs from "node:fs";
import path from "node:path";
import type { RadarItem } from "./radar-helpers";

export type { RadarItem, RadarVerdict } from "./radar-helpers";
export { getCloneCommand, getRadarImage } from "./radar-helpers";

const RADAR_DIR = path.join(process.cwd(), "content", "radar");

interface RadarDayFile {
  date: string;
  items: Omit<RadarItem, "date">[];
}

/** Reads every content/radar/*.json day file and flattens them, newest first. */
export function getAllRadarItems(): RadarItem[] {
  if (!fs.existsSync(RADAR_DIR)) return [];

  const files = fs.readdirSync(RADAR_DIR).filter((f) => f.endsWith(".json"));

  const items: RadarItem[] = files.flatMap((file) => {
    const raw = fs.readFileSync(path.join(RADAR_DIR, file), "utf-8");
    const day = JSON.parse(raw) as RadarDayFile;
    return day.items.map((item) => ({ ...item, date: day.date }));
  });

  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getRadarItemBySlug(slug: string): RadarItem | undefined {
  return getAllRadarItems().find((item) => item.slug === slug);
}

/** Every distinct tag across all items, for building filter UIs. */
export function getAllRadarTags(items: RadarItem[]): string[] {
  const tags = new Set<string>();
  items.forEach((item) => item.tags?.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}
