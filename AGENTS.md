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

Live search now, not a static file — RxNorm alone has hundreds of
thousands of concepts, too many to usefully commit to JSON (this is why
`content/health-codes/medications.json` and `scripts/fetch-rxnorm.mjs`
were removed; don't recreate them). `content/health-codes/_meta.json` is
the only file left here — the coding system's own version/publisher
info, CodeSystem-shaped. Types (loosely FHIR: `Coding`, `CodeableConcept`,
`Medication`) plus `formIconKey()`: `lib/health-codes-helpers.ts`.
`lib/health-codes.ts` just reads `_meta.json` (same client/server split
convention as Radar/Prompts, though this file barely touches `node:fs`
anymore).

Route: `app/api/health-codes/search/route.ts` proxies live to
**RxTerms** (NLM's Clinical Table Search Service,
`clinicaltables.nlm.nih.gov/api/rxterms/v3/search`) — free, official, no
key, and built specifically for partial-word autocomplete, unlike plain
RxNorm `drugs.json` (which needs a full/normalized name — that was the
first version of this route, and why searching "aceta" used to return
nothing until you typed the whole word). Its response is a **positional
array**, not a keyed object —
`[count, displayNames[], {STRENGTHS_AND_FORMS, RXCUIS}, dfRows[]]`; the
parser in `route.ts` was checked against NLM's own two worked examples
from their docs (not just assumed), since this sandbox can't reach the
live endpoint to confirm it directly. `cleanDrugName()` strips RxTerms'
trailing route hint ("ARAVA (Oral Pill)" → "ARAVA") — that cleaned name
is what feeds the DailyMed image/reference lookup below; the original
version passed DailyMed the full compound RxNorm-style string (e.g.
"famotidine 26.6 MG / ibuprofen 800 MG Oral Tablet [Duexis]") and it
mostly came back "not found."

The route also looks up a real product image per result via
`lib/dailymed.ts` (capped to the first 5 results per search since each
is 2 extra requests). UI: `components/HealthCodeSearch.tsx` (client,
debounced fetch to that route) + `components/FormIcon.tsx` (small
dose-form icons, matched via `formIconKey()` — handles both full words
and RxTerms' abbreviations like "Tab"/"Cap"). Every result's name links
out to its RxNav reference page (`sourceUrl`) — **there is no internal
`/health-codes/[id]` route**; it was removed along with the static file
it depended on. Don't link a result to an internal path again — that's
a 404 waiting to happen.

**On pill images**: NLM's Pillbox and RxImage (the free, official
pill-appearance-by-photo APIs) were both retired in 2021; NLM's own
retirement notice says the leftover static files "should not be used for
pill identification." `lib/dailymed.ts` is the current answer — real
images tied to an actual regulatory submission for the matched name, via
DailyMed's documented `/spls.json` → `/spls/{setid}/media.json` flow.
This was written from DailyMed's docs; this sandbox can't reach
`dailymed.nlm.nih.gov` to confirm the exact JSON nesting against a live
response, so `extractFirstImageUrl` tries a couple of plausible shapes
and fails soft (falls back to a "view on DailyMed" link) rather than
guessing wrong. If images still don't appear once this runs somewhere
with real network access, log a raw response there and adjust the
extraction — don't switch to a generic image-search API (Google, Bing,
Wikimedia Commons, etc.) as a fallback: an unrelated or wrong-strength
photo next to real coding data is actively misleading in a health
context, worse than no photo.

**On pricing**: no free, unified, genuinely global drug-pricing API
exists — pricing is jurisdiction-specific and mostly behind commercial
or institutional access. Don't wire one up; don't fabricate figures.

**On "search by condition"**: RxNorm's `name` param matches drug/
ingredient names, not disease/condition terms — searching "diabetes"
here won't find much, because it's a drug database, not an indications
database. The real path for that is NLM's **RxClass** API (drug class
membership, including indication-based classes) — not wired up yet.
Whatever gets built for it must stay a **static classification lookup**
("drugs registered under class X"), never a live system that takes a
freeform symptom description and generates a drug suggestion for
anonymous visitors — that's dispensing medical guidance with no clinical
context (allergies, interactions, actual diagnosis) to an audience not
equipped to evaluate it. If asked to "connect this to the agent" for
live symptom-based suggestions, decline and point back to this note.

This section is a reference tool, not medical advice — keep the
disclaimer banner on `app/health-codes/page.tsx` intact whenever this is
edited.

## Home-page health widgets

`components/MedicalArticlesSection.tsx` (`lib/medical-articles.ts`) —
recent PubMed-indexed articles via NLM's E-utilities (real, free). PubMed
has no public trending/engagement metric, so this sorts by publish date
and is labeled "recent," not "trending" — don't relabel it without a
source that backs the stronger claim. Rendered on the home page right
under the Prompts ticker.

There used to also be a COVID-19/flu stats widget here
(`components/HealthStatsWidget.tsx` / `lib/health-stats.ts`, sourced from
disease.sh) — removed at the user's request, along with its files. Don't
recreate it unless asked.

