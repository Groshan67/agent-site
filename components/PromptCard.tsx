import Link from "next/link";
import CopyButton from "./CopyButton";
import type { PromptItem } from "@/lib/prompts-helpers";

export default function PromptCard({ item }: { item: PromptItem }) {
  const openUrl = item.tweetUrl ?? item.sourceUrl;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative aspect-video w-full bg-background">
        {item.media?.type === "video" ? (
          <video
            src={item.media.url}
            controls
            playsInline
            className="h-full w-full object-cover"
          />
        ) : item.media?.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.media.url}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-3xl text-muted">
            {item.title.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link href={`/prompts/${item.slug}`} className="group">
          <h3 className="font-medium text-foreground transition-colors group-hover:text-accent">
            {item.title}
          </h3>
        </Link>

        <p className="line-clamp-4 text-sm text-muted">{item.body}</p>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2 py-0.5 font-mono text-xs text-accent"
              >
                #{tag}
              </span>
            ))}
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
