# Prompts task

Two ways to add prompts here. Neither needs the X API or a login.

## A) From a URL you're given (the main path)

When someone hands you one or more X/Twitter post URLs (in Telegram or
anywhere), for each URL:

1. Fetch the public page at that URL — no login needed, it's a public
   post page (unless the account is protected, in which case skip it and
   say so).
2. Extract: the post text, hashtags, the author's handle, and the post
   date.
3. For media specifically — X's post pages are JS-heavy, so a plain fetch
   often won't show images/video in the visible content even when the
   tweet clearly has them. Before giving up, check the page's raw HTML
   `<head>` for OpenGraph tags: `og:image` (and `og:image:1`, `og:image:2`,
   `:3` if present, for multi-photo tweets) and `og:video`/`og:video:url`.
   These are usually present even when the rendered page isn't. Collect
   every image/video url you can confirm into a `media` array — a tweet
   can have several photos, or one video; grab all of them, not just the
   first. If you still can't get any working media url after checking OG
   tags, say so explicitly in your reply instead of silently continuing —
   don't just omit `media` without mentioning it.
4. Check content/prompts/ for a file with the same `tweetId` — skip if
   it's already there.
5. Write `content/prompts/<slug>.md`: frontmatter `title` (first ~80
   chars of the text), `tags` (the hashtags), `date`, `author` (handle,
   no @), `tweetUrl` (the url you were given), `tweetId` (the numeric id
   from the url), `media` (a list — `[{url, type: "image"|"video"}, ...]`,
   omit the key entirely if none found). Body: the full post text, written
   as-is (don't paraphrase someone else's prompt).
6. Run `npm run build`. Fix anything that fails. Commit
   ("prompts: <slug>"), push.
7. Reply with what got added, and flag anything (like missing media) that
   needs a second look.

## B) Proactive discovery (optional, like Radar)

If asked to "find some prompts" with no specific URLs: look at public
sources — X search/hashtag pages, r/PromptEngineering, relevant GitHub
repos, newsletters — for AI prompts worth sharing. Same extraction and
write steps as above. Keep this to occasional, light browsing, the way a
person would check a few pages by hand — not bulk automated scraping.

## What not to do

Don't install or use any library that logs into X with real account
credentials to reach its private/internal API (twikit and similar
"no API key needed" tools) to pull bookmarks or anything else. That's
against X's terms and risks the account being suspended. Public page
reads only, at a human pace.
