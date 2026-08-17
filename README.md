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

## What's next

This is the skeleton phase only — no agent, no automation loop yet, and the
copy on the home page is a placeholder for you to rewrite. See `AGENTS.md`
for the content conventions an agent (or a future you) should follow.

## Deploying

Push to GitHub and import the repo on Vercel — zero config needed, it
detects Next.js automatically.
