import Link from "next/link";
import { getAllRadarItems } from "@/lib/radar";

export const metadata = { title: "Radar" };

export default function RadarPage() {
  const items = getAllRadarItems();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-medium tracking-tight text-foreground">Radar</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        AI &amp; open-source projects worth your time, added daily.
      </p>

      <ul className="mt-10 space-y-4">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/radar/${item.slug}`}
              className="block rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-medium text-foreground">{item.name}</h2>
                <span className="font-mono text-xs text-muted">{item.date}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{item.take}</p>
              {item.tags && item.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs text-accent">
                  {item.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted">
            Nothing here yet — add a day file under{" "}
            <code className="font-mono text-accent">content/radar/</code>.
          </p>
        )}
      </ul>
    </div>
  );
}
