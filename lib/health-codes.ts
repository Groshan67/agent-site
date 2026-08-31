import fs from "node:fs";
import path from "node:path";
import type { CodeSystemMeta, MedicationEntry } from "./health-codes-helpers";

export type { CodeSystemMeta, MedicationEntry, Coding, CodeableConcept } from "./health-codes-helpers";
export { isExampleEntry } from "./health-codes-helpers";

const DIR = path.join(process.cwd(), "content", "health-codes");

export function getCodeSystemMeta(): CodeSystemMeta | undefined {
  const file = path.join(DIR, "_meta.json");
  if (!fs.existsSync(file)) return undefined;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function getAllMedications(): MedicationEntry[] {
  const file = path.join(DIR, "medications.json");
  if (!fs.existsSync(file)) return [];
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  return Array.isArray(data) ? data : [];
}

export function getMedicationById(id: string): MedicationEntry | undefined {
  return getAllMedications().find((m) => m.id === id);
}
