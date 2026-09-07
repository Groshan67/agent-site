// Looks up a real drug-appearance image from DailyMed (NLM's official FDA
// label database — active and current, unlike the retired RxImage/Pillbox
// APIs). Two real, documented calls:
//   1. /spls.json?drug_name=X          -> a setid
//   2. /spls/{setid}/media.json        -> image file URLs for that label
// Docs: https://dailymed.nlm.nih.gov/dailymed/webservices-help/
//
// Caveat: this was written from DailyMed's documented XML shape and the
// partial JSON shown in their docs — this sandbox can't reach
// dailymed.nlm.nih.gov to confirm the exact JSON key nesting against a
// live response, so the property lookups below try a couple of plausible
// shapes defensively. If images still don't show up once this runs for
// real, log a raw response and adjust `extractFirstImageUrl` — the
// two-request flow itself is correct either way.

const DAILYMED_BASE = "https://dailymed.nlm.nih.gov/dailymed/services/v2";

interface DailyMedMediaFile {
  name?: string;
  url?: string;
  mime_type?: string;
}

async function fetchJsonSafe(url: string): Promise<unknown> {
  const res = await fetch(url, { next: { revalidate: 86400 } }); // labels barely change day to day
  if (!res.ok) return undefined;
  return res.json();
}

function extractFirstImageUrl(mediaResponse: unknown): string | undefined {
  const data = mediaResponse as Record<string, unknown> | undefined;
  const media = data?.media as Record<string, unknown> | undefined;

  // Try a couple of plausible shapes for the file list.
  const candidates =
    (media?.file as DailyMedMediaFile[] | DailyMedMediaFile | undefined) ??
    (data?.file as DailyMedMediaFile[] | DailyMedMediaFile | undefined);

  const file = Array.isArray(candidates) ? candidates[0] : candidates;
  return file?.url;
}

/** Best-effort — returns undefined on any failure rather than throwing. */
export async function findDailyMedImage(drugName: string): Promise<string | undefined> {
  try {
    const searchData = (await fetchJsonSafe(
      `${DAILYMED_BASE}/spls.json?drug_name=${encodeURIComponent(drugName)}&pagesize=1`,
    )) as { data?: { setid?: string }[] } | undefined;

    const setid = searchData?.data?.[0]?.setid;
    if (!setid) return undefined;

    const mediaData = await fetchJsonSafe(`${DAILYMED_BASE}/spls/${setid}/media.json`);
    return extractFirstImageUrl(mediaData);
  } catch {
    return undefined;
  }
}
