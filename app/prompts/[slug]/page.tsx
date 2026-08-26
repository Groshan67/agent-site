import { notFound } from "next/navigation";
import { getAllPrompts, getPromptBySlug } from "@/lib/prompts";
import { getPromptImage } from "@/lib/prompts-helpers";
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
      <p className="font-mono text-xs text-muted">
        {prompt.author && `@${prompt.author} · `}
        {prompt.date}
      </p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-foreground">
        {prompt.title}
      </h1>

      {prompt.media && prompt.media.length > 0 ? (
        <div
          className={`mt-6 grid gap-2 ${prompt.media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {prompt.media.map((m) => (
            <div key={m.url} className="overflow-hidden rounded-lg border border-border">
              {m.type === "video" ? (
                <video src={m.url} controls playsInline className="w-full" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt="" className="w-full object-cover" />
              )}
            </div>
          ))}
        </div>
      ) : (
        // no media of its own — fall back to a stable placeholder photo
        <div className="mt-6 overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getPromptImage(prompt)} alt="" className="w-full object-cover" />
        </div>
      )}

      {prompt.tags && prompt.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-accent"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 whitespace-pre-wrap rounded-lg border border-border bg-card p-5 text-sm leading-relaxed text-foreground">
        {prompt.body}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <CopyButton text={prompt.body} label="copy prompt" />
        {(prompt.tweetUrl ?? prompt.sourceUrl) && (
          <a
            href={prompt.tweetUrl ?? prompt.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted transition-colors hover:text-accent"
          >
            open original ↗
          </a>
        )}
      </div>
    </div>
  );
}
