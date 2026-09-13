// PubMed's E-utilities (NIH/NLM, free, no key strictly required) has no
// public "trending"/engagement metric to sort by, so this fetches the
// most RECENT indexed articles instead and is labeled that way — calling
// it "trending" would overclaim what the API actually provides.

export interface MedicalArticle {
  pmid: string;
  title: string;
  journal: string;
  pubDate: string;
  url: string;
}

const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

export async function getRecentMedicalArticles(): Promise<MedicalArticle[]> {
  try {
    const searchRes = await fetch(
      `${EUTILS}/esearch.fcgi?db=pubmed&term=medicine&sort=date&retmax=10&retmode=json`,
      { next: { revalidate: 3600 } },
    );
    if (!searchRes.ok) return [];
    const searchData = await searchRes.json();
    const ids: string[] = searchData.esearchresult?.idlist ?? [];
    if (ids.length === 0) return [];

    const summaryRes = await fetch(
      `${EUTILS}/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`,
      { next: { revalidate: 3600 } },
    );
    if (!summaryRes.ok) return [];
    const summaryData = await summaryRes.json();
    const result = summaryData.result ?? {};

    return ids
      .map((id) => result[id])
      .filter((item): item is Record<string, string> => Boolean(item))
      .map((item) => ({
        pmid: item.uid,
        title: item.title,
        journal: item.source,
        pubDate: item.pubdate,
        url: `https://pubmed.ncbi.nlm.nih.gov/${item.uid}/`,
      }));
  } catch {
    return [];
  }
}
