import Link from "next/link";
import { getAllRadarItems } from "@/lib/radar";
import RadarCard from "@/components/RadarCard";

export default function Home() {
  const latest = getAllRadarItems().slice(0, 8);

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
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
              latest on radar
            </h2>
            <Link
              href="/radar"
              className="font-mono text-xs text-accent transition-colors hover:text-foreground"
            >
              view all →
            </Link>
          </div>
          <ul className="mt-4 space-y-4">
            {latest.map((item) => (
              <li key={item.slug}>
                <RadarCard
                  item={item}
                  tagHref={(tag) => `/radar?tag=${encodeURIComponent(tag)}`}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
