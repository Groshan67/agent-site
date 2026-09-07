// Shared types for the Health Codes section. Search now hits a live API
// route (app/api/health-codes/search) backed by RxNorm — not a static
// file. RxNorm alone has hundreds of thousands of concepts, far too many
// to usefully pre-bake into a committed JSON file, which is why this
// moved off content/health-codes/medications.json.
//
// Loosely FHIR-shaped (Coding / CodeableConcept / Medication) — enough
// structure to be recognizable to anyone who knows FHIR, without running
// an actual FHIR server or API.

export interface Coding {
  system: string; // canonical URI for the code system (RxNorm)
  code: string;
  display: string;
}

export interface CodeableConcept {
  coding: Coding[];
  text?: string;
}

export interface MedicationEntry {
  resourceType: "Medication";
  id: string; // "rxnorm-<rxcui>"
  code: CodeableConcept;
  genericNameEn?: string;
  form?: string; // dose form: tablet, capsule, oral solution, ...
  status: "active";
  lastUpdated: string; // ISO date — set to "today" at request time, since
  // this is a live lookup, not a dated dataset
  sourceUrl: string;
  imageUrl?: string; // real image from DailyMed's official FDA label data,
  // when found — see lib/dailymed.ts. Never a guessed/generic image.
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

/** Maps an RxNorm/RxTerms-style dose-form string to a small icon category for FormIcon. */
export function formIconKey(
  form?: string,
): "tablet" | "capsule" | "liquid" | "injectable" | "inhalant" | "topical" | "other" {
  if (!form) return "other";
  const f = form.toLowerCase();
  if (f.includes("tab")) return "tablet"; // covers "tablet" and RxTerms' "Tab"
  if (f.includes("cap")) return "capsule"; // "capsule" / "Cap"
  if (f.includes("sol") || f.includes("susp") || f.includes("syrup") || f.includes("cartridge"))
    return "liquid";
  if (f.includes("inj")) return "injectable";
  if (f.includes("inhal") || f.includes("spray") || f.includes("nasal")) return "inhalant";
  if (f.includes("cream") || f.includes("crm") || f.includes("oint") || f.includes("patch") || f.includes("topical"))
    return "topical";
  return "other";
}
