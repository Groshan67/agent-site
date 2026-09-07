// disease.sh is real, free, and live — but it only covers COVID-19 and
// influenza specifically. There is no free, unified API for "most common
// illnesses generally" (checked CDC, WHO GHO, and a few aggregators —
// nothing that fits without a paid/keyed service or heavy reporting lag).
// This is presented as what it actually is: COVID/flu activity, not a
// general illness leaderboard. See AGENTS.md.

export interface GlobalHealthStats {
  todayCases: number;
  todayDeaths: number;
  active: number;
  updatedAt: number; // epoch ms, as reported by the source
}

export async function getGlobalHealthStats(): Promise<GlobalHealthStats | null> {
  try {
    const res = await fetch("https://disease.sh/v3/covid-19/all", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    return {
      todayCases: data.todayCases ?? 0,
      todayDeaths: data.todayDeaths ?? 0,
      active: data.active ?? 0,
      updatedAt: data.updated ?? Date.now(),
    };
  } catch {
    return null;
  }
}
