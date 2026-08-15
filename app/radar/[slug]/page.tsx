import { notFound } from "next/navigation";
import { getAllRadarItems, getRadarItemBySlug } from "@/lib/radar";

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
      <p className="font-mono text-xs text-muted">{item.date}</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-foreground">
        {item.name}
      </h1>

      {item.verdict && (
        <span className="mt-3 inline-block rounded-full border border-accent/40 px-3 py-1 font-mono text-xs text-accent">
          {item.verdict}
        </span>
      )}

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

      <a
        href={item.url}
        className="mt-10 inline-block rounded-md border border-border bg-card px-4 py-2 font-mono text-sm transition-colors hover:border-accent hover:text-accent"
      >
        source →
      </a>
    </div>
  );
}
