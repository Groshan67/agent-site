"use client";

import { useMemo, useState } from "react";
import PromptCard from "./PromptCard";
import type { PromptItem } from "@/lib/prompts-helpers";

type SortMode = "newest" | "alphabetical";

export default function PromptsExplorer({ items }: { items: PromptItem[] }) {
  // Draft values follow the inputs live; applied values only change when
  // the Apply button is clicked.
  const [draftQuery, setDraftQuery] = useState("");
  const [draftSort, setDraftSort] = useState<SortMode>("newest");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [appliedSort, setAppliedSort] = useState<SortMode>("newest");
  const [activeTag, setActiveTag] = useState<string | undefined>();

  const isDirty = draftQuery !== appliedQuery || draftSort !== appliedSort;

  function applyFilters() {
    setAppliedQuery(draftQuery);
    setAppliedSort(draftSort);
  }

  const results = useMemo(() => {
    const q = appliedQuery.trim().toLowerCase();

    let list = items.filter((item) => {
      if (activeTag && !item.tags?.includes(activeTag)) return false;
      if (!q) return true;
      const haystack = [item.title, item.body, ...(item.tags ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    list = [...list].sort((a, b) =>
      appliedSort === "alphabetical"
        ? a.title.localeCompare(b.title)
        : a.date < b.date
          ? 1
          : -1,
    );

    return list;
  }, [items, appliedQuery, appliedSort, activeTag]);

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center">
        <input
          type="text"
          value={draftQuery}
          onChange={(e) => setDraftQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          placeholder="Search prompts or tags…"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />

        <select
          value={draftSort}
          onChange={(e) => setDraftSort(e.target.value as SortMode)}
          className="rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="alphabetical">Alphabetical</option>
        </select>

        <button
          onClick={applyFilters}
          className="rounded-md border border-accent/50 bg-accent/10 px-4 py-2 font-mono text-xs text-accent transition-colors hover:bg-accent/20"
        >
          Apply{isDirty ? " •" : ""}
        </button>
      </div>

      {activeTag && (
        <button
          onClick={() => setActiveTag(undefined)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-3 py-1 font-mono text-xs text-accent"
        >
          #{activeTag} <span aria-hidden>×</span>
        </button>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <PromptCard key={item.slug} item={item} onTagClick={setActiveTag} />
        ))}
      </div>

      {results.length === 0 && (
        <p className="mt-10 text-sm text-muted">Nothing matches that search.</p>
      )}
    </div>
  );
}
