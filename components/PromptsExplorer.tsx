"use client";

import { useMemo, useState } from "react";
import PromptCard from "./PromptCard";
import type { PromptItem } from "@/lib/prompts-helpers";

type SortMode = "newest" | "alphabetical";
const PAGE_SIZE = 9;

export default function PromptsExplorer({ items }: { items: PromptItem[] }) {
  const [draftQuery, setDraftQuery] = useState("");
  const [draftSort, setDraftSort] = useState<SortMode>("newest");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [appliedSort, setAppliedSort] = useState<SortMode>("newest");
  const [activeTag, setActiveTag] = useState<string | undefined>(undefined);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const isDirty = draftQuery !== appliedQuery || draftSort !== appliedSort;

  function handleApply() {
    setAppliedQuery(draftQuery);
    setAppliedSort(draftSort);
  }

  const filtered = useMemo(() => {
    const q = appliedQuery.trim().toLowerCase();
    let result = items.filter((item) => {
      if (activeTag && !item.tags?.includes(activeTag)) return false;
      if (!q) return true;
      const haystack = [item.title, item.body, ...(item.tags ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    result = [...result].sort((a, b) =>
      appliedSort === "alphabetical"
        ? a.title.localeCompare(b.title)
        : a.date < b.date
          ? 1
          : -1,
    );

    return result;
  }, [items, appliedQuery, appliedSort, activeTag]);

  // Reset to the first page when the actual applied filter changes — done
  // during render (React's recommended pattern), not in an effect:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const filterKey = `${appliedQuery}::${appliedSort}::${activeTag ?? ""}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center">
        <input
          type="text"
          value={draftQuery}
          onChange={(e) => setDraftQuery(e.target.value)}
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
          onClick={handleApply}
          className="relative rounded-md border border-border bg-background px-4 py-2 font-mono text-xs text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Apply
          {isDirty && (
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent" />
          )}
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

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((prompt) => (
          <PromptCard key={prompt.slug} item={prompt} onTagClick={setActiveTag} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-sm text-muted">Nothing matches that search.</p>
      )}

      {remaining > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="rounded-md border border-border bg-card px-5 py-2 font-mono text-xs text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            load {Math.min(remaining, PAGE_SIZE)} more ({remaining} left)
          </button>
        </div>
      )}
    </div>
  );
}
