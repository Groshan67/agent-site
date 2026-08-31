"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { MedicationEntry } from "@/lib/health-codes-helpers";
import { isExampleEntry } from "@/lib/health-codes-helpers";

export default function HealthCodeSearch({ items }: { items: MedicationEntry[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      // Matches on name/code AND on category — searching a condition
      // like "diabetes" surfaces medications whose reference category
      // mentions it. This is classification lookup, not a diagnosis or
      // treatment recommendation.
      const haystack = [
        item.code.text ?? "",
        item.code.coding.map((c) => `${c.code} ${c.display}`).join(" "),
        item.genericNameEn ?? "",
        item.category ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search by name, code, or category (e.g. "diabetes")…'
        className="w-full rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-card font-mono text-xs text-muted">
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Code</th>
              <th className="px-4 py-3 font-normal">Category</th>
              <th className="px-4 py-3 font-normal">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((item) => {
              const primary = item.code.coding[0];
              return (
                <tr key={item.id} className="transition-colors hover:bg-card">
                  <td className="px-4 py-3">
                    <Link
                      href={`/health-codes/${item.id}`}
                      className="text-foreground transition-colors hover:text-accent"
                    >
                      {primary?.display ?? item.code.text}
                    </Link>
                    {isExampleEntry(item) && (
                      <span className="ml-2 rounded-md border border-accent/40 px-1.5 py-0.5 font-mono text-[10px] text-accent">
                        example
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {primary?.code}
                  </td>
                  <td className="px-4 py-3 text-muted">{item.category ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{item.form ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-4 text-sm text-muted">No matches.</p>
        )}
      </div>
    </div>
  );
}
