#!/usr/bin/env node
// Populates content/health-codes/medications.json with real drug data
// from RxNorm — the U.S. National Library of Medicine's free, public,
// official drug nomenclature API. No key needed, ~20 req/sec limit.
// Docs: https://lhncbc.nlm.nih.gov/RxNav/APIs/index.html
//
// This intentionally does NOT fetch pricing — there is no free, unified,
// genuinely "global" drug-pricing API (pricing is jurisdiction-specific,
// mostly behind commercial or institutional access). If you want prices,
// add them by hand per entry via the optional `priceUSD` field, sourced
// from wherever you trust for your specific market — don't wire up a
// scraper for a pricing site without checking its terms first.
//
// Usage: node scripts/fetch-rxnorm.mjs [names...]
//   (with no args, fetches the default SEED_NAMES below)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "content", "health-codes", "medications.json");

const RXNORM_BASE = "https://rxnav.nlm.nih.gov/REST";

// A starting seed list of common, well-known generic names. Edit freely —
// this is just a starting point, not a curated "recommended drugs" list.
const SEED_NAMES = [
  "acetaminophen",
  "ibuprofen",
  "amoxicillin",
  "metformin",
  "atorvastatin",
  "lisinopril",
  "omeprazole",
  "amlodipine",
  "metoprolol",
  "albuterol",
];

// Broad, informational therapeutic categories for the seed list above —
// hand-set, not fetched. This is what search-by-category matches against;
// it is reference classification, not a treatment recommendation.
const CATEGORY_HINTS = {
  acetaminophen: "Analgesic / Antipyretic",
  ibuprofen: "NSAID / Analgesic",
  amoxicillin: "Antibiotic (Penicillin class)",
  metformin: "Antidiabetic (Biguanide)",
  atorvastatin: "Statin / Lipid-lowering",
  lisinopril: "ACE Inhibitor",
  omeprazole: "Proton Pump Inhibitor",
  amlodipine: "Calcium Channel Blocker",
  metoprolol: "Beta-blocker",
  albuterol: "Bronchodilator",
};

const DOSE_FORMS = [
  "Oral Tablet",
  "Extended Release Oral Tablet",
  "Disintegrating Oral Tablet",
  "Oral Capsule",
  "Oral Solution",
  "Oral Suspension",
  "Injectable Solution",
  "Topical Cream",
  "Topical Ointment",
  "Inhalant",
  "Nasal Spray",
];

function guessForm(rxNormName) {
  return DOSE_FORMS.find((f) => rxNormName.includes(f));
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchEntriesFor(genericName) {
  const url = `${RXNORM_BASE}/drugs.json?name=${encodeURIComponent(genericName)}`;
  const data = await fetchJson(url);
  const groups = data.drugGroup?.conceptGroup ?? [];

  // Prefer SCD (generic clinical drug: ingredient + strength + dose form)
  // over branded/packaged variants — most relevant for a reference lookup.
  const scdGroup = groups.find((g) => g.tty === "SCD" && g.conceptProperties);
  const fallbackGroup = groups.find((g) => g.conceptProperties);
  const props = (scdGroup ?? fallbackGroup)?.conceptProperties ?? [];

  // Cap at 3 per ingredient — some have dozens of strengths/forms, and
  // this is a demo seed list, not an exhaustive import.
  return props.slice(0, 3).map((p) => ({
    resourceType: "Medication",
    id: `rxnorm-${p.rxcui}`,
    code: {
      coding: [
        {
          system: "http://www.nlm.nih.gov/research/umls/rxnorm",
          code: p.rxcui,
          display: p.name,
        },
      ],
      text: p.name,
    },
    genericNameEn: genericName,
    form: guessForm(p.name),
    category: CATEGORY_HINTS[genericName],
    status: "active",
    lastUpdated: new Date().toISOString().slice(0, 10),
    sourceUrl: `https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${p.rxcui}`,
  }));
}

async function main() {
  const names = process.argv.slice(2);
  const targets = names.length > 0 ? names : SEED_NAMES;

  const entries = [];
  for (const name of targets) {
    try {
      const found = await fetchEntriesFor(name);
      if (found.length === 0) {
        console.log(`(skip) no RxNorm concepts found for "${name}"`);
        continue;
      }
      entries.push(...found);
      console.log(`+ ${name}: ${found.length} entr${found.length === 1 ? "y" : "ies"}`);
    } catch (err) {
      console.error(`(error) ${name}: ${err.message}`);
    }
  }

  if (entries.length === 0) {
    console.error("\nNothing fetched — check your network connection and try again.");
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(entries, null, 2) + "\n");

  console.log(`\nWrote ${entries.length} entries to ${OUT_PATH}`);
  console.log(
    "\nAttribution (keep this somewhere visible on the page, e.g. the CodeSystem\n" +
      "description in _meta.json already has it):\n" +
      '"This product uses publicly available data from the U.S. National Library\n' +
      'of Medicine (NLM), United States Department of Health and Human Services;\n' +
      'NLM is not responsible for the site\'s contents."',
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
