# Daily Radar task

This is the standing task for the agent. Point Codex at this file (e.g. in
Telegram: "follow docs/radar-task.md and run today's radar") to run it.

1. Find 3-5 AI or open-source projects with real traction in the last
   24-48h (GitHub trending, Hacker News, relevant subreddits, X if
   reachable).
2. Pick 1-3 that are genuinely worth sharing. Skip anything derivative or
   low-signal — quality over quantity.
3. For each pick, write in your own words (not copied from any source):
   - take: what it is, 1-2 sentences
   - why: why it's worth a look, 1-2 sentences
   - explanation (optional): a longer note for the detail page
   - tags: 2-4 short tags
   - verdict: must-watch / worth-testing / worth-sharing / interesting / skip
   - category: a short type label, e.g. "CLI Tool", "Library", "Framework"
   - author (optional, if known): the project author/org
   - rating (optional): your own 1-5 confidence score
   - status (optional): active / archived / trending
   - image (optional): leave unset for github.com urls — the site falls
     back to GitHub's own OG image automatically
4. Create today's file at content/radar/YYYY-MM-DD.json (real date) using
   the schema in AGENTS.md. Slugs must be unique across every day file —
   check existing files under content/radar/ first.
5. Run `npm run build`. Fix anything that fails before continuing.
6. Commit ("radar: YYYY-MM-DD") and push to main.
7. Reply with a one-line summary of what got added.

Do not proceed past step 5 if the build fails — fix it first.
