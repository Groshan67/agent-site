import Link from "next/link";
import { getAllPrompts } from "@/lib/prompts";

export const metadata = { title: "Prompts" };

export default function PromptsPage() {
  const prompts = getAllPrompts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-medium tracking-tight text-foreground">Prompts</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        A public library of prompts worth reusing.
      </p>

      <ul className="mt-10 space-y-4">
        {prompts.map((prompt) => (
          <li key={prompt.slug}>
            <Link
              href={`/prompts/${prompt.slug}`}
              className="block rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-medium text-foreground">{prompt.title}</h2>
                <span className="font-mono text-xs text-muted">{prompt.date}</span>
              </div>
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs text-accent">
                  {prompt.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
        {prompts.length === 0 && (
          <p className="text-sm text-muted">
            Nothing here yet — add a file under{" "}
            <code className="font-mono text-accent">content/prompts/</code>.
          </p>
        )}
      </ul>
    </div>
  );
}
