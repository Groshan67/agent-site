"use client";

import { useState } from "react";
import Link from "next/link";
import CopyButton from "./CopyButton";
import type { PromptItem } from "@/lib/prompts-helpers";
import SmartP from "./SmartP";

export default function PromptCard({
  item,
  onTagClick,
}: {
  item: PromptItem;
  /** If provided, tags become filter buttons instead of plain pills. */
  onTagClick?: (tag: string) => void;
}) {
  const media = item.media ?? [];
  const [index, setIndex] = useState(0);
  const current = media[index];
  const openUrl = item.tweetUrl ?? item.sourceUrl;

  function next(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + 1) % media.length);
  }
  function prev(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i - 1 + media.length) % media.length);
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="group relative aspect-video w-full bg-background">
        {current?.type === "video" ? (
          <video
            key={current.url}
            src={current.url}
            controls
            playsInline
            className="h-full w-full object-cover"
          />
        ) : current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={current.url}
            src={current.url}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-3xl text-muted">
            {item.title.charAt(0).toUpperCase()}
          </div>
        )}

        {media.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous media"
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next media"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
            >
              ›
            </button>
            <span className="absolute bottom-2 right-2 rounded-full bg-background/80 px-2 py-0.5 font-mono text-[10px] text-muted">
              {index + 1}/{media.length}
            </span>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link href={`/prompts/${item.slug}`} className="group/title">
          <h3 className="font-medium text-foreground transition-colors group-hover/title:text-accent">
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
