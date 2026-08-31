<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project-specific notes

Two content types, stored as flat files, no database:

- **Radar** (`content/radar/YYYY-MM-DD.json`) — one file per day, `items[]`
  array. Required: `slug` (unique across every day file), `name`, `url`,
  `take`, `why`. Optional: `image` (falls back to the GitHub OG image for
  github.com urls), `tags`, `verdict`, `explanation`, `author`,
  `category`, `cloneCommand` (auto-derived from `url` if omitted),
  `rating` (1-5), `status`. Types + fs-backed loader: `lib/radar.ts`.
  Fs-free helpers + the `RadarItem` type: `lib/radar-helpers.ts` — import
  from there, not `lib/radar.ts`, in anything that runs in the browser
  (`lib/radar.ts` uses `node:fs`, breaks the client bundle otherwise).
  Card: `components/RadarCard.tsx`. Search + "load more" pagination:
  `components/RadarSearch.tsx` (client, `PAGE_SIZE = 6`, resets to page 1
  when the search/tag filter changes). Routes: `app/radar/page.tsx`
  (list), `app/radar/[slug]/page.tsx` (detail).

- **Prompts** (`content/prompts/*.md`) — one Markdown file per prompt,
  YAML frontmatter (`title`, `tags`, `sourceUrl`, `date`, optionally
  `media` — a list, `[{url, type: "image"|"video"}, ...]` — `tweetUrl`,
  `author`, `tweetId`) + prompt text as the body. Files starting with `_`
  are ignored. Types: `lib/prompts-helpers.ts` (client-safe, also has
  `getFallbackImage(slug)` — a seeded Picsum URL used whenever a prompt
  has no media, so the same prompt always gets the same placeholder
  image). Fs-backed loader: `lib/prompts.ts` — same client/server split as
  Radar; also accepts a single old-style `media` object for files written
  before this was a list. Card: `components/PromptCard.tsx`, media shown
  via `components/PromptMediaCarousel.tsx` (next/prev when an item has
  more than one image/video). Grid + search/sort + "load more":
  `components/PromptsExplorer.tsx` (client, `PAGE_SIZE = 9`, sort is
  Newest/Alphabetical, staged until "Apply", resets pagination when the
  applied filter changes). Home-page teaser: `components/PromptsTicker.tsx`
  (auto-scrolling marquee, pauses on hover/reduced-motion). Routes:
  `app/prompts/page.tsx` (grid), `app/prompts/[slug]/page.tsx` (detail,
  shows every media item in a grid rather than a carousel).

Primary way to populate Prompts now: `docs/prompts-task.md` (agent fetches
public post URLs it's given — no login, no paid API; checks OG meta tags
for media since a plain fetch of X's JS-heavy pages often misses images
otherwise). `scripts/x-auth.mjs` / `scripts/fetch-x-prompts.mjs` are a
parked, optional path using the official paid X API — not the default.
Never use a library that logs into X with real account credentials
(twikit and similar) — against X's terms, risks the account.

Radar's standing task: `docs/radar-task.md`.

`scripts/trigger-radar.sh` / `.ps1` and `scripts/trigger-prompts.sh` / `.ps1`
run their task directly via `codex exec --sandbox danger-full-access` on a
cron/Task Scheduler schedule, then post a one-way result notification to
Telegram (a bot can't message itself to trigger a run — Telegram won't
deliver that as an update — so these call `codex exec` directly instead).
They defensively fix `HOME` if cron gives them a bad one (codex's login
lives under `$HOME`); if a run still 401s, the documented fallback is
`CODEX_API_KEY` (separate OpenAI platform billing, not a ChatGPT
subscription). `scripts/trigger-radar-opencode.sh` /
`trigger-prompts-opencode.sh` are the free-model alternative (`opencode
run --model opencode/nemotron-3-ultra-free`) — wrapped in a 20-minute
`timeout` because non-interactive `opencode run` has known issues hanging
on an unanswerable permission prompt; confirm a real end-to-end manual run
before trusting either in cron.

`app/page.tsx` renders, top to bottom: hero, `components/AboutSection.tsx`
(photo — falls back to an initials circle if `public/profile.jpg` doesn't
exist — bio, and live GitHub projects via `lib/github.ts`, fetched at
build time from GitHub's public REST API, no auth; set `GITHUB_USERNAME`
there, typed `: string` on purpose so the "still the placeholder" check
doesn't become a TypeScript error once it's changed), then Latest Radar
and Top Prompts as two columns (`lg:grid-cols-2`, stacks on mobile).

Design tokens live in `app/globals.css` (`--background`, `--foreground`,
`--card`, `--border`, `--muted`, `--accent`, plus the `marquee` keyframes
for the ticker). Reuse them instead of introducing new colors.

## Health Codes (drug coding reference)

`content/health-codes/medications.json` (one array, not day-files) +
`content/health-codes/_meta.json` (the coding system's own version info —
currently RxNorm/NLM). Data shapes are loosely modeled on FHIR R4
(`Coding`, `CodeableConcept`, `Medication`, `CodeSystem`) — see
`lib/health-codes-helpers.ts` — but this is a static reference dataset,
not an actual FHIR server; no AWS, no FHIR API. Fs-backed loader:
`lib/health-codes.ts` (same client/server split as Radar/Prompts — don't
import it into a Client Component). Search UI:
`components/HealthCodeSearch.tsx` (client, instant filter, English,
matches name/code AND category). Routes: `app/health-codes/page.tsx`
(search + disclaimer + CodeSystem version banner),
`app/health-codes/[id]/page.tsx` (detail).

Real data source: **RxNorm** (`rxnav.nlm.nih.gov/REST`), the U.S. National
Library of Medicine's free, public, no-key API — genuinely official and
international-standard, unlike guessed/fabricated codes. Populate with
`node scripts/fetch-rxnorm.mjs [names...]` (defaults to a small seed
list if no names given). Keep the NLM attribution line
("This product uses publicly available data from the U.S. National
Library of Medicine...") visible somewhere on the page — it's currently
in `_meta.json`'s `description`, shown in the version banner.

The shipped `medications.json` entries are placeholders (`id` starting
with `example-`, flagged via `isExampleEntry()` and shown with an
"example" badge in the UI) until the fetch script has been run.

**On pricing**: there is no free, unified, genuinely global drug-pricing
API — pricing is jurisdiction-specific and mostly behind commercial or
institutional access. `priceUSD` is an optional, manually-filled field
for exactly this reason — don't wire up a scraper against a pricing
site without checking its terms of use first, and don't fabricate price
figures.

**On "search by condition"**: the search box matches the `category`
field (a hand-set, informational therapeutic classification) as well as
name/code, so typing a condition like "diabetes" surfaces medications
whose category references it — this is static reference classification,
the same kind of thing a print formulary's index does. This is
deliberately **not** a live AI system that takes freeform symptom
descriptions and generates drug suggestions for anonymous site visitors
— that would be dispensing medical guidance without any clinical context
(allergies, interactions, actual diagnosis), to an audience that isn't
necessarily equipped to evaluate it. Don't add that. If asked to
"connect this to the agent" for live suggestions, decline and point back
to this note.

This section is a reference tool, not medical advice — keep that framing
(the disclaimer banner on the list page, the "example"/placeholder
flagging) intact whenever this content is edited.

