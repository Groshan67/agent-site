"use client";

import { useMemo, useState } from "react";
import RadarCard from "./RadarCard";
import type { RadarItem } from "@/lib/radar-helpers";

export default function RadarSearch({
  items,
  initialTag,
}: {
  items: RadarItem[];
  initialTag?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | undefined>(initialTag);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (activeTag && !item.tags?.includes(activeTag)) return false;
      if (!q) return true;
      const haystack = [item.name, item.take, item.why, ...(item.tags ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, activeTag]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <IconSearch />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects or tags…"
            className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {activeTag && (
        <button
          onClick={() => setActiveTag(undefined)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-3 py-1 font-mono text-xs text-accent"
        >
          #{activeTag} <span aria-hidden>×</span>
        </button>
      )}

      <ul className="mt-6 space-y-4">
        {filtered.map((item,index) => (
          <li key={`${item.slug}-${index}`}>
            <RadarCard item={item} onTagClick={setActiveTag} />
          </li>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted">Nothing matches that search.</p>
        )}
      </ul>
    </div>
  );
}

function IconSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
