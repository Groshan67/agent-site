import Link from "next/link";
import CopyButton from "./CopyButton";
import { getCloneCommand, getRadarImage, type RadarItem } from "@/lib/radar-helpers";

export default function RadarCard({
  item,
  tagHref,
  onTagClick,
}: {
  item: RadarItem;
  /** Render tags as links (e.g. on the home page, linking to /radar?tag=x). */
  tagHref?: (tag: string) => string;
  /** Render tags as buttons that update in-page filter state (the /radar page). */
  onTagClick?: (tag: string) => void;
}) {
  const image = getRadarImage(item);

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-card sm:flex-row">
      <div className="relative aspect-video w-full shrink-0 bg-background sm:aspect-auto sm:w-[35%]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="absolute inset-0 m-auto h-auto w-auto max-h-full max-w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-3xl text-muted">
            {item.name.charAt(0).toUpperCase()}
          </div>
        )}
        {item.status && (
          <span className="absolute left-2 top-2 rounded-full border border-border bg-background/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
            {item.status}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-foreground">{item.name}</h3>
          {item.rating !== undefined && <StarRating rating={item.rating} />}

        </div>

        <p className="text-sm text-muted">{item.take}</p>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) =>
              onTagClick ? (
                <button
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className="rounded-full border border-border px-2 py-0.5 font-mono text-xs text-accent transition-colors hover:border-accent"
                >
                  #{tag}
                </button>
              ) : (
                <Link
                  key={tag}
                  href={tagHref ? tagHref(tag) : `/radar?tag=${tag}`}
                  className="rounded-full border border-border px-2 py-0.5 font-mono text-xs text-accent transition-colors hover:border-accent"
                >
                  #{tag}
                </Link>
              ),
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted">
          <span>{item.date}</span>
          {item.author && <span>by {item.author}</span>}
          {item.category && <span>{item.category}</span>}
        </div>

        <div className="mt-auto flex flex-wrap justify-end gap-2 pt-2">
          <CopyButton text={item.url} label="copy repo url" />
          <CopyButton text={getCloneCommand(item)} label="copy clone command" />
          <Link
            href={`/radar/${item.slug}`}
            className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            view details →
          </Link>
        </div>
      </div>
    </article>
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
