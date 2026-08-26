"use client";

import { useState } from "react";
import type { PromptMedia } from "@/lib/prompts-helpers";
import {  getFallbackImage } from "@/lib/prompts-helpers";

export default function PromptMediaCarousel({
  media,
  title,
  slug,
}: {
  media?: PromptMedia[];
  title: string;
  slug: string;
}) {
  const [index, setIndex] = useState(0);
  const items = media && media.length > 0 ? media : undefined;
  const current = items?.[index];

  return (
    <div className="group relative aspect-video w-full bg-background">
      {current ? (
        current.type === "video" ? (
          <video src={current.url} controls playsInline className="h-full w-full object-cover" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.url} alt={title} className="h-full w-full object-cover" loading="lazy" />
        )
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getFallbackImage(slug)}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      )}

      {items && items.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Previous"
          >
            <IconChevron direction="left" />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % items.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Next"
          >
            <IconChevron direction="right" />
          </button>
          <span className="absolute bottom-2 right-2 rounded-full bg-background/80 px-2 py-0.5 font-mono text-[10px] text-muted">
            {index + 1}/{items.length}
          </span>
        </>
      )}
    </div>
  );
}

function IconChevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}
