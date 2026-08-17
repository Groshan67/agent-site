<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project-specific notes

This site has two content types stored as flat files, not a database:

- **Radar** (`content/radar/YYYY-MM-DD.json`) — one file per day, each with an
  `items[]` array. Required fields: `slug` (unique across every day file),
  `name`, `url`, `take`, `why`. Optional: `image` (falls back to the GitHub
  OG image if the url is a github.com repo), `tags`, `verdict`,
  `explanation`, `author`, `category`, `cloneCommand` (auto-derived from
  `url` if omitted), `rating` (1-5), `status`. Types + fs-backed loader:
  `lib/radar.ts`. Fs-free helpers + the `RadarItem` type: `lib/radar-helpers.ts`
  — import from there, not from `lib/radar.ts`, in anything that runs in the
  browser (Client Components), since `lib/radar.ts` uses `node:fs` and will
  break the client bundle if imported into one. Card UI: `components/RadarCard.tsx`.
  Search/filter: `components/RadarSearch.tsx` (client). Routes:
  `app/radar/page.tsx` (list + search), `app/radar/[slug]/page.tsx` (detail).
- **Prompts** (`content/prompts/*.md`) — one Markdown file per prompt, with
  YAML frontmatter (`title`, `tags`, `sourceUrl`, `date`, and optionally
  `media` (`{url, type: "image"|"video"}`), `tweetUrl`, `author`, `tweetId`)
  and the prompt text as the body. Files starting with `_` are ignored.
  Types: `lib/prompts-helpers.ts` (client-safe). Fs-backed loader:
  `lib/prompts.ts` — same client/server split as Radar, don't import it from
  a Client Component. Card UI: `components/PromptCard.tsx` (magazine-style,
  media-first, 3-column grid on `app/prompts/page.tsx`). Routes:
  `app/prompts/page.tsx` (grid), `app/prompts/[slug]/page.tsx` (detail).
  Primary way to populate this now: `docs/prompts-task.md` (agent fetches
  public post URLs it's given — no login, no paid API). `scripts/x-auth.mjs`
  and `scripts/fetch-x-prompts.mjs` are a parked, optional path using the
  official paid X API if that ever makes sense — not the default. Never use
  a library that logs into X with real account credentials (twikit and
  similar) — against X's terms, risks the account.

To add a Radar item: append to today's day file (create it if missing) with a
unique `slug`, then run `npm run build` to confirm it compiles.

To add a Prompt: add a new `content/prompts/<slug>.md` file with frontmatter.

Design tokens live in `app/globals.css` (`--background`, `--foreground`,
`--card`, `--border`, `--muted`, `--accent`). Reuse them instead of
introducing new colors.

