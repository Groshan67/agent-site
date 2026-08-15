import Link from "next/link";
import { getAllRadarItems } from "@/lib/radar";

export default function Home() {
  const latest = getAllRadarItems().slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        signal, not noise
      </p>
      <h1 className="mt-4 max-w-2xl text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
        Building in the open. Some of it written by an agent.
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
        This is a personal site with a twist: an autonomous agent runs part of
        it. Every day it scans for interesting AI &amp; open-source projects
        and files them under Radar. Replace this paragraph with your own
        intro.
      </p>

      <div className="mt-8 flex gap-4 font-mono text-sm">
        <Link
          href="/radar"
          className="rounded-md border border-border bg-card px-4 py-2 transition-colors hover:border-accent hover:text-accent"
        >
          view radar →
        </Link>
        <Link
          href="/prompts"
          className="rounded-md border border-border bg-card px-4 py-2 transition-colors hover:border-accent hover:text-accent"
        >
          view prompts →
        </Link>
      </div>

      {latest.length > 0 && (
        <section className="mt-20">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
            latest on radar
          </h2>
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {latest.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/radar/${item.slug}`}
                  className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent"
                >
                  <span>{item.name}</span>
                  <span className="font-mono text-xs text-muted">{item.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
