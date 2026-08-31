import { notFound } from "next/navigation";
import { getAllMedications, getMedicationById } from "@/lib/health-codes";
import { isExampleEntry } from "@/lib/health-codes-helpers";

export function generateStaticParams() {
  return getAllMedications().map((m) => ({ id: m.id }));
}

export default async function HealthCodeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getMedicationById(id);

  if (!item) notFound();

  const primary = item.code.coding[0];

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {isExampleEntry(item) && (
        <div className="mb-6 rounded-lg border border-accent/40 bg-card p-3 font-mono text-xs text-accent">
          This is a placeholder example record, not a real medication.
        </div>
      )}

      <p className="font-mono text-xs text-muted">
        {primary?.system} · {item.status}
      </p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-foreground">
        {primary?.display ?? item.code.text}
      </h1>
      {item.genericNameEn && (
        <p className="mt-1 font-mono text-sm text-muted">{item.genericNameEn}</p>
      )}

      <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <dt className="font-mono text-xs uppercase tracking-wide text-muted">Code</dt>
          <dd className="mt-1 font-mono text-foreground">{primary?.code}</dd>
        </div>
        {item.category && (
          <div className="rounded-lg border border-border bg-card p-4">
            <dt className="font-mono text-xs uppercase tracking-wide text-muted">Category</dt>
            <dd className="mt-1 text-foreground">{item.category}</dd>
          </div>
        )}
        {item.form && (
          <div className="rounded-lg border border-border bg-card p-4">
            <dt className="font-mono text-xs uppercase tracking-wide text-muted">Dose form</dt>
            <dd className="mt-1 text-foreground">{item.form}</dd>
          </div>
        )}
        {item.manufacturer && (
          <div className="rounded-lg border border-border bg-card p-4">
            <dt className="font-mono text-xs uppercase tracking-wide text-muted">Manufacturer</dt>
            <dd className="mt-1 text-foreground">{item.manufacturer}</dd>
          </div>
        )}
        {item.priceUSD !== undefined && (
          <div className="rounded-lg border border-border bg-card p-4">
            <dt className="font-mono text-xs uppercase tracking-wide text-muted">Price (manual entry)</dt>
            <dd className="mt-1 text-foreground">${item.priceUSD}</dd>
          </div>
        )}
      </dl>

      {item.notes && (
        <p className="mt-8 text-sm leading-relaxed text-muted">{item.notes}</p>
      )}

      <p className="mt-8 font-mono text-xs text-muted">
        Last updated: {item.lastUpdated}
      </p>

      {item.sourceUrl && (
        <a
          href={item.sourceUrl}
          className="mt-4 inline-block rounded-md border border-border bg-card px-4 py-2 font-mono text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Source ↗
        </a>
      )}
    </div>
  );
}
