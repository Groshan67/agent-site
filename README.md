# agent-site

Personal site skeleton with two file-backed content sections — **Radar**
(curated AI/open-source finds) and **Prompts** (a public prompt library) —
built so an AI agent can eventually maintain them. No database: content is
just JSON and Markdown committed to this repo.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4

## Run locally

```
npm install
npm run dev
```

Open http://localhost:3000.

```
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint
```

## Project structure

```
app/                 Routes: home, radar (search), radar/[slug], prompts, prompts/[slug]
components/           SiteChrome, CopyButton, RadarCard, RadarSearch (client)
content/radar/        One JSON file per day, e.g. 2026-08-10.json
content/prompts/      One Markdown file per prompt, with frontmatter
lib/                  radar.ts (fs-backed loader, server-only),
                       radar-helpers.ts (fs-free types/helpers, client-safe),
                       prompts.ts (loader)
AGENTS.md             Notes for an AI agent (or you) editing this repo
```

## Adding content

**Radar** — add or edit `content/radar/YYYY-MM-DD.json`:

```json
{
  "date": "2026-08-11",
  "items": [
    {
      "slug": "unique-slug",
      "name": "Project Name",
      "url": "https://...",
      "tags": ["tag1", "tag2"],
      "verdict": "worth-testing",
      "take": "What it is, in one or two sentences.",
      "why": "Why it's worth a look.",
      "explanation": "Optional longer note for the detail page.",
      "author": "optional",
      "category": "optional, e.g. CLI Tool",
      "cloneCommand": "optional, auto-derived from url if omitted",
      "rating": 4,
      "status": "optional, e.g. active"
    }
  ]
}
```

`image` is optional too — leave it out for `github.com` urls and the site
pulls GitHub's own OG image automatically.

## Prompts from X bookmarks

`app/prompts` renders a 3-column magazine grid. You can add prompts by hand
(see `content/prompts/example-prompt.md`) or pull them from your X bookmarks:

```
export X_CLIENT_ID=...          # from developer.x.com
export X_CLIENT_SECRET=...      # only if your app is a confidential client
node scripts/x-auth.mjs         # one-time: opens a browser, saves x-tokens.json
node scripts/fetch-x-prompts.mjs         # imports top bookmarks with media
node scripts/fetch-x-prompts.mjs --all   # skip the AI-keyword filter
```

Your X app needs the `bookmark.read`, `tweet.read`, `users.read`, and
`offline.access` scopes, OAuth 2.0 enabled, and `http://127.0.0.1:8787/callback`
registered as a callback URL. `x-tokens.json` is gitignored — never commit it.
This path is parked for now — the default way to add prompts is sending a
post URL to the Telegram bot; see `docs/prompts-task.md`.

**Prompts** — add `content/prompts/<slug>.md`:

```md
---
title: "Prompt title"
tags: ["tag1"]
sourceUrl: "https://..."
date: "2026-08-11"
---

The prompt text itself.
```

## Free-model alternative (no billing needed)

`scripts/trigger-radar-opencode.sh` and `scripts/trigger-prompts-opencode.sh`
do the same job as the scripts above but call `opencode run` with a free
model (`opencode/nemotron-3-ultra-free`) instead of `codex exec` — no
OpenAI platform billing, no CODEX_API_KEY. **Before scheduling either of
these**, run it manually once and confirm two things: it actually returns
to your shell prompt (some versions of `opencode run` are known to hang
indefinitely waiting for a permission prompt with nobody there to answer
it), and it actually produced the expected result (a new file under
`content/radar/` or `content/prompts/`). The scripts wrap the call in a
20-minute `timeout` so a hang gets reported as a bounded failure instead
of a stuck process piling up day after day — but that's a safety net, not
a substitute for confirming a real successful run first. Same crontab
pattern as above, just point at these scripts instead.

## Running Radar and Prompts on a schedule

`docs/radar-task.md` and `docs/prompts-task.md` (option B) are the daily
jobs. `scripts/trigger-radar.*` and `scripts/trigger-prompts.*` (`.sh` for
Linux/macOS/WSL2, `.ps1` for Windows) run them directly via `codex exec` —
**not** by messaging the Telegram bot. (Earlier versions of these scripts
sent the trigger message to the bot itself; Telegram doesn't deliver an
update for a bot messaging itself, so OpenDray never saw it and nothing
ran, even though the message appeared in the chat. `codex exec` is
OpenAI's documented headless/automation mode and reuses the same login
`codex` already has on this machine — no new auth needed.) Each script
still posts a one-way result notification to Telegram afterward (bot to
*you*, which works fine), so you keep visibility into what happened.

1. Get your chat id once: message the bot anything, then
   `curl "https://api.telegram.org/bot<TOKEN>/getUpdates"` and read
   `message.chat.id` from the response.
2. Check `codex` resolves the way cron/Task Scheduler will see it —
   `which codex` (or `Get-Command codex` on Windows). Cron and Task
   Scheduler often run with a much smaller PATH than your interactive
   shell; if the plain `codex` command doesn't resolve in a fresh
   non-interactive shell, use the full path from `which codex` in your
   schedule entry, or add a `PATH=` line to the top of your crontab.
3. Watch for `401 Unauthorized` in the Telegram failure notification or
   the log file. It means `codex exec` couldn't find your ChatGPT login
   under cron even though `codex` works fine interactively — usually
   because cron runs with `HOME` unset or wrong, and the login is stored
   under `$HOME`. The scripts already try to fix this automatically (they
   detect a bad `HOME` and resolve it via `getent passwd`), and log
   `HOME=... whoami=... codex=...` at the top of each run so you can see
   what they saw. If it still 401s, switch to the officially documented
   automation auth path instead: create an API key at
   platform.openai.com/api-keys, then add `CODEX_API_KEY=sk-...` to the
   same crontab line as the other env vars — no script changes needed,
   `codex exec` picks it up automatically. Note this key draws from
   OpenAI **platform** billing, which is separate from a ChatGPT
   subscription — you'll need billing set up there specifically, which
   may hit the same kind of access friction discussed earlier for other
   US AI platforms.
3. Test each one manually first:
   `TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... ./scripts/trigger-radar.sh`
   `TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... ./scripts/trigger-prompts.sh`
4. Schedule them (two separate entries, a bit apart so they don't overlap):
   - Linux/macOS/WSL2 — `crontab -e`:
     ```
     PATH=/usr/local/bin:/usr/bin:/bin:/home/you/.local/bin
     0 8 * * *  TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... /path/to/agent-site/scripts/trigger-radar.sh   >> /tmp/trigger-radar.log 2>&1
     30 8 * * * TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... /path/to/agent-site/scripts/trigger-prompts.sh >> /tmp/trigger-prompts.log 2>&1
     ```
     (adjust the `PATH=` line to wherever `which codex` / `which npm` /
     `which git` actually point)
   - Windows (native) — Task Scheduler → one basic task per script, daily
     trigger (stagger the times), action = start a program:
     `powershell.exe`, arguments
     `-File "C:\path\to\agent-site\scripts\trigger-radar.ps1"` (and the
     `trigger-prompts.ps1` equivalent for the second task). Set
     `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` as system environment
     variables first, or add them inline in the action.

## What's next

Radar and Prompts both have working agent tasks and can run on a schedule
(see above). From here it's mostly content and polish — personalize the
home page copy, and decide if/when the parked X-API path in
`docs/prompts-task.md` is worth revisiting.

## Deploying

Push to GitHub and import the repo on Vercel — zero config needed, it
detects Next.js automatically.
