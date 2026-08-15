<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project-specific notes

This site has two content types stored as flat files, not a database:

- **Radar** (`content/radar/YYYY-MM-DD.json`) — one file per day, each with an
  `items[]` array. Loader: `lib/radar.ts`. Slugs must be unique across every
  day file. Routes: `app/radar/page.tsx` (list), `app/radar/[slug]/page.tsx`
  (detail).
- **Prompts** (`content/prompts/*.md`) — one Markdown file per prompt, with
  YAML frontmatter (`title`, `tags`, `sourceUrl`, `date`) and the prompt text
  as the body. Files starting with `_` are ignored. Loader: `lib/prompts.ts`.
  Routes: `app/prompts/page.tsx` (list), `app/prompts/[slug]/page.tsx`
  (detail).

To add a Radar item: append to today's day file (create it if missing) with a
unique `slug`, then run `npm run build` to confirm it compiles.

To add a Prompt: add a new `content/prompts/<slug>.md` file with frontmatter.

Design tokens live in `app/globals.css` (`--background`, `--foreground`,
`--card`, `--border`, `--muted`, `--accent`). Reuse them instead of
introducing new colors.

