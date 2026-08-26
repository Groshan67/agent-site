import fs from "node:fs";
import path from "node:path";
import { getGithubProjects } from "@/lib/github";

export default async function AboutSection() {
  const projects = await getGithubProjects();
  const hasPhoto = fs.existsSync(path.join(process.cwd(), "public", "profile.jpg"));

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="shrink-0">
          {hasPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/profile.jpg"
              alt="Ghasem Roshan"
              className="h-32 w-32 rounded-full border border-border object-cover"
            />
          ) : (
            <div
              className="flex h-32 w-32 items-center justify-center rounded-full border border-border bg-card font-mono text-3xl text-accent"
              aria-label="Photo placeholder"
            >
              GR
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-medium text-foreground">Ghasem Roshan</h2>
          <p className="mt-1 font-mono text-sm text-accent">Full-stack developer</p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            8+ years building with Node.js, TypeScript, React, Next.js, and
            PostgreSQL.
          </p>

          {projects.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {projects.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-border bg-card p-3 transition-colors hover:border-accent"
                >
                  <p className="truncate text-sm font-medium text-foreground">
                    {p.name}
                  </p>
                  {p.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted">
                      {p.description}
                    </p>
                  )}
                  <p className="mt-2 font-mono text-xs text-muted">
                    {p.language && `${p.language} · `}★ {p.stars}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-md border border-border bg-card p-3 font-mono text-xs text-muted">
              Set GITHUB_USERNAME in lib/github.ts to show your projects here.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
