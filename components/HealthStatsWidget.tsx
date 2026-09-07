import { getGlobalHealthStats } from "@/lib/health-stats";

export default async function HealthStatsWidget() {
  const stats = await getGlobalHealthStats();
  if (!stats) return null;

  const updated = new Date(stats.updatedAt).toISOString().slice(0, 10);

  return (
    <section className="mx-auto max-w-6xl px-6">
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
            COVID-19 &amp; flu activity — global, today
          </h2>
          <span className="font-mono text-xs text-muted">{updated}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <Stat label="new cases" value={stats.todayCases} />
          <Stat label="new deaths" value={stats.todayDeaths} />
          <Stat label="active cases" value={stats.active} />
        </div>
        <p className="mt-4 font-mono text-[11px] text-muted">
          Source: disease.sh — covers COVID-19 &amp; influenza specifically,
          not a general illness ranking.
        </p>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-2xl font-medium text-foreground">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 font-mono text-xs text-muted">{label}</p>
    </div>
  );
}
