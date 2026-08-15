import { notFound } from "next/navigation";
import { getAllPrompts, getPromptBySlug } from "@/lib/prompts";
import CopyButton from "@/components/CopyButton";

export function generateStaticParams() {
  return getAllPrompts().map((p) => ({ slug: p.slug }));
}

export default async function PromptItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);

  if (!prompt) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs text-muted">{prompt.date}</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-foreground">
        {prompt.title}
      </h1>

      {prompt.tags && prompt.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs text-accent">
          {prompt.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      )}

      <div className="mt-8 whitespace-pre-wrap rounded-lg border border-border bg-card p-5 text-sm leading-relaxed text-foreground">
        {prompt.body}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <CopyButton text={prompt.body} />
        {prompt.sourceUrl && (
          <a
            href={prompt.sourceUrl}
            className="font-mono text-xs text-muted transition-colors hover:text-accent"
          >
            source →
          </a>
        )}
      </div>
    </div>
  );
}
