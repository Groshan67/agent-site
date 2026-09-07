import { NextRequest, NextResponse } from "next/server";
import type { MedicationEntry } from "@/lib/health-codes-helpers";
import { findDailyMedImage } from "@/lib/dailymed";

// RxTerms (NLM's Clinical Table Search Service) is built for exactly this
// case — partial-word autocomplete — unlike RxNorm's plain drugs.json,
// which needs a full/normalized name. Real, free, official, no key.
// Docs: https://clinicaltables.nlm.nih.gov/apidoc/rxterms/v3/doc.html
const RXTERMS_BASE = "https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search";

// RxTerms' response is a positional array, not a keyed object:
// [ totalCount, displayNames[], { STRENGTHS_AND_FORMS: [][], RXCUIS: [][] }, dfRows[] ]
// Verified against the two worked examples in NLM's own docs.
type RxTermsResponse = [
  number,
  string[],
  { STRENGTHS_AND_FORMS?: string[][]; RXCUIS?: string[][] },
  string[][],
];

function guessForm(text: string): string | undefined {
  const forms = [
    "extended release",
    "disintegrating",
    "tablet",
    "tab",
    "capsule",
    "cap",
    "solution",
    "sol",
    "suspension",
    "susp",
    "syrup",
    "cartridge",
    "injectable",
    "injection",
    "inj",
    "cream",
    "crm",
    "ointment",
    "oint",
    "inhalant",
    "spray",
    "patch",
  ];
  const lower = text.toLowerCase();
  return forms.find((f) => lower.includes(f));
}

/** Strips the trailing route hint RxTerms adds, e.g. "ARAVA (Oral Pill)" -> "ARAVA". */
function cleanDrugName(displayName: string): string {
  return displayName.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [], query: q });
  }

  try {
    const url = `${RXTERMS_BASE}?terms=${encodeURIComponent(q)}&maxList=12&ef=STRENGTHS_AND_FORMS,RXCUIS`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      return NextResponse.json(
        { results: [], query: q, error: `RxTerms returned ${res.status}` },
        { status: 502 },
      );
    }

    const data = (await res.json()) as RxTermsResponse;
    const [, displayNames, extra] = data;
    const strengthsAndForms = extra?.STRENGTHS_AND_FORMS ?? [];
    const rxcuisList = extra?.RXCUIS ?? [];

    const results: MedicationEntry[] = [];
    const today = new Date().toISOString().slice(0, 10);

    for (let i = 0; i < displayNames.length; i++) {
      const baseName = displayNames[i];
      const clean = cleanDrugName(baseName);
      const forms = strengthsAndForms[i] ?? [];
      const rxcuis = rxcuisList[i] ?? [];

      // Each display name can have several strength/form + RXCUI pairs
      // (e.g. "10 mg Tab" / "20 mg Tab") — list each as its own row.
      for (let j = 0; j < forms.length && results.length < 30; j++) {
        const rxcui = rxcuis[j];
        if (!rxcui) continue;

        results.push({
          resourceType: "Medication",
          id: rxcui,
          code: {
            coding: [
              {
                system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                code: rxcui,
                display: `${baseName} ${forms[j]}`,
              },
            ],
            text: `${baseName} ${forms[j]}`,
          },
          genericNameEn: clean,
          form: guessForm(forms[j]),
          status: "active",
          lastUpdated: today,
          sourceUrl: `https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${rxcui}`,
        });
      }

      // A display name with no strength/form breakdown at all — still
      // worth showing as a bare match.
      if (forms.length === 0 && results.length < 30) {
        results.push({
          resourceType: "Medication",
          id: `name-${i}-${clean}`,
          code: {
            coding: [
              {
                system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                code: "",
                display: baseName,
              },
            ],
            text: baseName,
          },
          genericNameEn: clean,
          status: "active",
          lastUpdated: today,
          sourceUrl: `https://mor.nlm.nih.gov/RxNav/search?searchBy=RXNORM&searchTerm=${encodeURIComponent(clean)}`,
        });
      }
    }

    // Real drug-appearance images for the first few results only — each
    // is 2 extra requests to DailyMed. The rest link out instead.
    const IMAGE_LOOKUP_LIMIT = 5;
    await Promise.all(
      results.slice(0, IMAGE_LOOKUP_LIMIT).map(async (entry) => {
        if (!entry.genericNameEn) return;
        entry.imageUrl = await findDailyMedImage(entry.genericNameEn);
      }),
    );

    return NextResponse.json({ results, query: q });
  } catch (err) {
    return NextResponse.json(
      { results: [], query: q, error: err instanceof Error ? err.message : "unknown error" },
      { status: 502 },
    );
  }
}
