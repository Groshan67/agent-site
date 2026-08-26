import Link from "next/link";
import { getPromptImage, type PromptItem } from "@/lib/prompts-helpers";

export default function PromptsTicker({ items }: { items: PromptItem[] }) {
  if (items.length === 0) return null;

  // Duplicate once so the CSS animation can loop seamlessly at -50%.
  const track = [...items, ...items];

  return (
    <div className="marquee-viewport overflow-hidden">
      <div className="marquee-track flex w-max gap-4">
        {track.map((item, i) => (
          <Link
            key={`${item.slug}-${i}`}
            href={`/prompts/${item.slug}`}
            className="block w-64 shrink-0 overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-accent"
          >
            <div className="aspect-video w-full bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getPromptImage(item)}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <p className="line-clamp-1 text-sm font-medium text-foreground">
                {item.title}
              </p>
              {item.tags && item.tags.length > 0 && (
                <p className="mt-1 truncate font-mono text-xs text-accent">
                  #{item.tags[0]}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
