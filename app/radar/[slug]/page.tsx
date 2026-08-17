import { notFound } from "next/navigation";
import { getAllRadarItems, getRadarItemBySlug, getCloneCommand } from "@/lib/radar";
import CopyButton from "@/components/CopyButton";

export function generateStaticParams() {
  return getAllRadarItems().map((item) => ({ slug: item.slug }));
}

export default async function RadarItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getRadarItemBySlug(slug);

  if (!item) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
        <span>{item.date}</span>
        {item.author && <span>by {item.author}</span>}
        {item.category && <span>{item.category}</span>}
        {item.status && <span>{item.status}</span>}
      </div>

      <h1 className="mt-2 text-3xl font-medium tracking-tight text-foreground">
        {item.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {item.verdict && (
          <span className="inline-block rounded-full border border-accent/40 px-3 py-1 font-mono text-xs text-accent">
            {item.verdict}
          </span>
        )}
        {item.rating !== undefined && (
          <span className="inline-block rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">
            ★ {item.rating}
          </span>
        )}
      </div>

      <section className="mt-8 space-y-2">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
          why it matters
        </h2>
        <p className="text-base leading-relaxed text-foreground">{item.why}</p>
      </section>

      {item.explanation && (
        <section className="mt-8 space-y-2">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
            more
          </h2>
          <p className="text-base leading-relaxed text-foreground">
            {item.explanation}
          </p>
        </section>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 font-mono text-xs text-accent">
          {item.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-2">
        <CopyButton text={item.url} label="copy repo url" />
        <CopyButton text={getCloneCommand(item)} label="copy clone command" />
        <a
          href={item.url}
          className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs transition-colors hover:border-accent hover:text-accent"
        >
          source →
        </a>
      </div>
    </div>
  );
}
