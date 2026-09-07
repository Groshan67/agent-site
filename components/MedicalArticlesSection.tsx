import { getRecentMedicalArticles } from "@/lib/medical-articles";

export default async function MedicalArticlesSection() {
  const articles = await getRecentMedicalArticles();
  if (articles.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
          recent medical research
        </h2>
        <a
          href="https://pubmed.ncbi.nlm.nih.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] text-muted transition-colors hover:text-accent"
        >
          via PubMed ↗
        </a>
      </div>
      <p className="mt-1 font-mono text-[11px] text-muted">
        Most recently indexed — not a ranked/trending list (PubMed doesn&rsquo;t expose one).
      </p>

      <ul className="mt-4 space-y-3">
        {articles.map((a) => (
          <li key={a.pmid}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
            >
              <ArticleIcon />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm text-foreground transition-colors group-hover:text-accent">
                  {a.title}
                </p>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-2 font-mono text-xs text-muted">
                  <span className="truncate">{a.journal}</span>
                  <span aria-hidden>·</span>
                  <span>{a.pubDate}</span>
                </p>
              </div>
              <span
                aria-hidden
                className="mt-1 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ArticleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="mt-0.5 shrink-0 text-accent"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6M9 9h1" />
    </svg>
  );
}
