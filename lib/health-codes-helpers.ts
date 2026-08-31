// Data shapes loosely modeled on FHIR R4 (Coding / CodeableConcept /
// Medication / CodeSystem) — enough structure to be recognizable to
// anyone who knows FHIR, without running an actual FHIR server. This is
// a static reference/lookup dataset, not a FHIR API.

export interface Coding {
  system: string; // canonical URI for the code system (e.g. RxNorm's system url)
  code: string;
  display: string;
}

export interface CodeableConcept {
  coding: Coding[];
  text?: string;
}

export type MedicationStatus = "active" | "inactive" | "entered-in-error";

export interface MedicationEntry {
  resourceType: "Medication";
  id: string; // slug, unique
  code: CodeableConcept; // e.g. RxNorm RxCUI + name
  genericNameEn?: string;
  form?: string; // dose form: tablet, capsule, oral solution, ...
  category?: string; // therapeutic category — used for both display AND
  // the "search by condition/category" reference lookup (see
  // HealthCodeSearch). Free-text on purpose: no live diagnostic matching.
  manufacturer?: string;
  status: MedicationStatus;
  priceUSD?: number; // fill in by hand from a source you trust — see
  // lib/health-codes.ts and AGENTS.md for why there's no automated feed
  lastUpdated: string; // ISO date
  sourceUrl?: string; // link to the official record, if available
  notes?: string; // reference notes only — never dosing/clinical advice
}

export interface CodeSystemMeta {
  resourceType: "CodeSystem";
  url: string;
  name: string;
  title: string;
  status: "active" | "retired" | "draft";
  version: string;
  date: string;
  publisher: string;
  description: string;
}

/** True only for the seed/placeholder entries shipped with the site. */
export function isExampleEntry(entry: MedicationEntry): boolean {
  return entry.id.startsWith("example-");
}
