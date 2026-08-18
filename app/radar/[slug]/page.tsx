import { notFound } from "next/navigation";
import { getAllRadarItems, getRadarItemBySlug, getCloneCommand, getRadarImage } from "@/lib/radar";
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
  const image = getRadarImage(item);


  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">

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
            <StarRating rating={item.rating} />
          </span>
        )}
      </div>

      
        <div className="mb-6 mt-6 w-full overflow-hidden rounded-2xl border border-border bg-card">

        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ backgroundColor: hashColor(item.name) }}
          >
            <span className="text-3xl font-semibold text-white/90">
              {item.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <section className="mt-8 space-y-2">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
          why it matters
        </h2>
        <p className="text-base leading-relaxed text-foreground">
          {item.why}
        </p>
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


function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span
      className="flex shrink-0 items-center gap-0.5"
      dir="ltr"
      aria-label={`Rate ${rating} as ${max}`}
    >
      {Array.from({ length: max }, (_, i) => (
        <IconStar key={i} filled={i < Math.round(rating)} />
      ))}
    </span>
  );
}

function IconStar({ filled }: { filled: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={filled ? "text-amber-400" : "text-muted-foreground/30"}
    >
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7L6 21l1.6-7L2.2 9.2l7.1-.6z" />
    </svg>
  );
}

function hashColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 65%, 45%)`;
}