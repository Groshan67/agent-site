import fs from "node:fs";
import path from "node:path";

const RADAR_DIR = path.join(process.cwd(), "content", "radar");

export type RadarVerdict =
  | "must-watch"
  | "worth-testing"
  | "worth-sharing"
  | "interesting"
  | "skip";

export interface RadarItem {
  slug: string;
  name: string;
  url: string;
  image?: string;
  tags?: string[];
  verdict?: RadarVerdict;
  take: string;
  why: string;
  explanation?: string;
  date: string;
}

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
