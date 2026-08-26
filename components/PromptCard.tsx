import Link from "next/link";
import CopyButton from "./CopyButton";
import PromptMediaCarousel from "./PromptMediaCarousel";
import type { PromptItem } from "@/lib/prompts-helpers";
import SmartP from "./SmartP";

export default function PromptCard({
  item,
  onTagClick,
}: {
  item: PromptItem;
  onTagClick?: (tag: string) => void;
}) {
  const openUrl = item.tweetUrl ?? item.sourceUrl;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <PromptMediaCarousel media={item.media} title={item.title} slug={item.slug} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link href={`/prompts/${item.slug}`} className="group">
          <h3 className="font-medium text-foreground transition-colors group-hover:text-accent">
            {item.title}
          </h3>
        </Link>

        <SmartP className="line-clamp-4 text-sm text-muted">{item.body}</SmartP>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) =>
              onTagClick ? (
                <button
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-accent transition-colors hover:border-accent"
                >
                  #{tag}
                </button>
              ) : (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-accent"
                >
                  #{tag}
                </span>
              ),
            )}
          </div>
        )}

        {(item.author || item.date) && (
          <p className="font-mono text-xs text-muted">
            {item.author && `@${item.author}`}
            {item.author && item.date && " · "}
            {item.date}
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <CopyButton text={item.body} label="copy prompt" />
          {openUrl && (
            <a
              href={openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              open original ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
