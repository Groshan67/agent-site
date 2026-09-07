"use client";

import { useEffect, useRef, useState } from "react";
import type { MedicationEntry } from "@/lib/health-codes-helpers";
import { formIconKey } from "@/lib/health-codes-helpers";
import FormIcon from "./FormIcon";

export default function HealthCodeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MedicationEntry[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (query.trim().length < 2) return; // cleared in handleQueryChange instead

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/health-codes/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setStatus(data.error ? "error" : "idle");
      } catch {
        setResults([]);
        setStatus("error");
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function handleQueryChange(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      setStatus("idle");
    } else {
      setStatus("loading");
    }
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        placeholder='Search by drug name (e.g. "ibuprofen")…'
        className="w-full rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-card font-mono text-xs text-muted">
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">RxCUI</th>
              <th className="px-4 py-3 font-normal">Dose form</th>
              <th className="px-4 py-3 font-normal">Appearance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {results.map((item) => {
              const primary = item.code.coding[0];
              return (
                <tr key={item.id} className="transition-colors hover:bg-card">
                  <td className="px-4 py-3">
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground transition-colors hover:text-accent"
                    >
                      {primary?.display ?? item.code.text}
                    </a>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{primary?.code}</td>
                  <td className="px-4 py-3 text-muted">
                    <span className="flex items-center gap-2">
                      <FormIcon formKey={formIconKey(item.form)} />
                      {item.form ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="h-10 w-10 rounded object-contain"
                      />
                    ) : (
                      <a
                        href={`https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${encodeURIComponent(
                          item.genericNameEn ?? item.code.text ?? "",
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-accent underline-offset-2 hover:underline"
                      >
                        view on DailyMed ↗
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {status === "loading" && (
          <p className="p-4 font-mono text-xs text-muted">Searching…</p>
        )}
        {status === "error" && (
          <p className="p-4 text-sm text-muted">
            Couldn&apos;t reach RxNorm just now — try again in a moment.
          </p>
        )}
        {status === "idle" && query.trim().length >= 2 && results.length === 0 && (
          <p className="p-4 text-sm text-muted">No matches.</p>
        )}
        {query.trim().length < 2 && (
          <p className="p-4 text-sm text-muted">Type at least 2 characters to search.</p>
        )}
      </div>
    </div>
  );
}
