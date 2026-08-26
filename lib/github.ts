// Fetches public repos for GITHUB_USERNAME via GitHub's public REST API
// (no auth needed for this). Runs at build time as part of static
// generation, not per-visitor, so the normal unauthenticated rate limit
// (60 req/hour) is a non-issue for a personal site.

const GITHUB_USERNAME: string = "Groshan67";

export interface GithubRepo {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
}

export async function getGithubProjects(): Promise<GithubRepo[]> {
  if (GITHUB_USERNAME === "your-github-username") return [];

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`,
      { headers: { Accept: "application/vnd.github+json" } },
    );

    if (!res.ok) {
      console.error(
        `[github.ts] GitHub API returned ${res.status} for user "${GITHUB_USERNAME}": ${await res.text()}`,
      );
      return [];
    }

    const repos = await res.json();
    if (!Array.isArray(repos)) {
      console.error(`[github.ts] Unexpected response shape (not an array):`, repos);
      return [];
    }

    return repos
    //   .filter((r) => !r.fork)      
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count ?? 0,
        language: r.language,
      }));
  } catch (err) {
    console.error(`[github.ts] Fetch failed for user "${GITHUB_USERNAME}":`, err);
    return [];
  }
}
