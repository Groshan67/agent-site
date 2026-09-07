import fs from "node:fs";
import path from "node:path";
import type { CodeSystemMeta } from "./health-codes-helpers";

export type { CodeSystemMeta, MedicationEntry } from "./health-codes-helpers";

const DIR = path.join(process.cwd(), "content", "health-codes");

export function getCodeSystemMeta(): CodeSystemMeta | undefined {
  const file = path.join(DIR, "_meta.json");
  if (!fs.existsSync(file)) return undefined;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}
