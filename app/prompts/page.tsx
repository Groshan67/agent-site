import { getAllPrompts } from "@/lib/prompts";
import PromptsExplorer from "@/components/PromptsExplorer";

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

      <div className="mt-8">
        <PromptsExplorer items={prompts} />
      </div>
    </div>
  );
}
