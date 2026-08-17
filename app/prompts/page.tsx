import { getAllPrompts } from "@/lib/prompts";
import PromptCard from "@/components/PromptCard";

export const metadata = { title: "Prompts" };

export default function PromptsPage() {
  const prompts = getAllPrompts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-medium tracking-tight text-foreground">Prompts</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        A public library of prompts worth reusing, sourced from bookmarks and
        curated finds.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.slug} item={prompt} />
        ))}
      </div>

      {prompts.length === 0 && (
        <p className="mt-10 text-sm text-muted">
          Nothing here yet — add a file under{" "}
          <code className="font-mono text-accent">content/prompts/</code>.
        </p>
      )}
    </div>
  );
}
