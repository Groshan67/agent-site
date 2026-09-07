import { getCodeSystemMeta } from "@/lib/health-codes";
import HealthCodeSearch from "@/components/HealthCodeSearch";

export const metadata = { title: "Health Codes" };

export default function HealthCodesPage() {
  const meta = getCodeSystemMeta();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-medium tracking-tight text-foreground">
        Health Codes
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Live search against RxNorm — the U.S. National Library of Medicine&apos;s
        official drug naming database. Nothing is stored here; every search
        queries RxNorm directly.
      </p>

      <div className="mt-6 rounded-lg border border-accent/40 bg-card p-4 text-sm text-muted">
        <p>
          ⚠️ This is a reference tool, not medical advice. It does not
          diagnose, prescribe, or recommend treatment — always consult a
          licensed doctor or pharmacist.
        </p>
        {meta && (
          <p className="mt-2 font-mono text-xs">
            Source: {meta.title} · {meta.publisher}
          </p>
        )}
      </div>

      <div className="mt-8">
        <HealthCodeSearch />
      </div>
    </div>
  );
}
