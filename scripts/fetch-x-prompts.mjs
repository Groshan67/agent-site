#!/usr/bin/env node
// Fetches your X bookmarks, keeps the ones with media that look
// AI/prompt-related, ranks them by engagement, and writes the top ones as
// content/prompts/*.md files. Run scripts/x-auth.mjs once first.
//
// Usage: node scripts/fetch-x-prompts.mjs [--limit 12] [--all]
//   --all   ignore the keyword filter and import any bookmark with media

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TOKENS_PATH = path.join(ROOT, "x-tokens.json");
const PROMPTS_DIR = path.join(ROOT, "content", "prompts");

const CLIENT_ID = process.env.X_CLIENT_ID;
const CLIENT_SECRET = process.env.X_CLIENT_SECRET;

// Tune this to your interests, or run with --all to skip filtering.
const KEYWORDS = [
  "ai", "prompt", "llm", "gpt", "claude", "chatgpt", "gemini",
  "agent", "midjourney", "stablediffusion", "genai",
];

const args = process.argv.slice(2);
const limitArg = args.indexOf("--limit");
const LIMIT = limitArg !== -1 ? Number(args[limitArg + 1]) : 12;
const SKIP_FILTER = args.includes("--all");

if (!CLIENT_ID) {
  console.error("Missing X_CLIENT_ID env var.");
  process.exit(1);
}
if (!fs.existsSync(TOKENS_PATH)) {
  console.error("No x-tokens.json found — run scripts/x-auth.mjs first.");
  process.exit(1);
}

async function refreshAccessToken() {
  const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, "utf-8"));

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: tokens.refresh_token,
    client_id: CLIENT_ID,
  });

  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  if (CLIENT_SECRET) {
    headers.Authorization =
      "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  }

  const res = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers,
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Refresh failed: ${JSON.stringify(json)}`);

  // X rotates the refresh token on use — save the new one or the next run breaks.
  fs.writeFileSync(
    TOKENS_PATH,
    JSON.stringify(
      {
        access_token: json.access_token,
        refresh_token: json.refresh_token ?? tokens.refresh_token,
        obtained_at: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  return json.access_token;
}

async function xFetch(accessToken, url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`X API error: ${JSON.stringify(json)}`);
  return json;
}

// async function xFetch(accessToken, url) {
//   console.log(`X API request: ${url}`);

//   const res = await fetch(url, {
//     headers: { Authorization: `Bearer ${accessToken}` },
//   });

//   const json = await res.json();

//   console.log(`X API response: ${res.status}`);

//   if (!res.ok) {
//     throw new Error(`X API error: ${JSON.stringify(json)}`);
//   }

//   return json;
// }

function bestVideoUrl(mediaObj) {
  const mp4s = (mediaObj.variants ?? []).filter(
    (v) => v.content_type === "video/mp4",
  );
  if (mp4s.length === 0) return undefined;
  return mp4s.sort((a, b) => (b.bit_rate ?? 0) - (a.bit_rate ?? 0))[0].url;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function getKnownTweetIds() {
  const known = new Set();
  if (!fs.existsSync(PROMPTS_DIR)) return known;
  for (const file of fs.readdirSync(PROMPTS_DIR)) {
    if (!file.endsWith(".md")) continue;
    const { data } = matter(fs.readFileSync(path.join(PROMPTS_DIR, file), "utf-8"));
    if (data.tweetId) known.add(String(data.tweetId));
  }
  return known;
}

async function main() {
  const accessToken = await refreshAccessToken();

  const me = await xFetch(accessToken, "https://api.x.com/2/users/me");
  const userId = me.data.id;

  const bookmarksUrl = new URL(`https://api.x.com/2/users/${userId}/bookmarks`);
  bookmarksUrl.searchParams.set("max_results", "100");
  bookmarksUrl.searchParams.set("expansions", "attachments.media_keys,author_id");
  bookmarksUrl.searchParams.set("tweet.fields", "created_at,entities,public_metrics");
  bookmarksUrl.searchParams.set("media.fields", "url,type,variants,preview_image_url");
  bookmarksUrl.searchParams.set("user.fields", "username");

  const page = await xFetch(accessToken, bookmarksUrl.toString());
  const tweets = page.data ?? [];
  const mediaById = new Map((page.includes?.media ?? []).map((m) => [m.media_key, m]));
  const usersById = new Map((page.includes?.users ?? []).map((u) => [u.id, u]));

  const known = getKnownTweetIds();
  fs.mkdirSync(PROMPTS_DIR, { recursive: true });

  let candidates = tweets.filter((t) => {
    if (known.has(t.id)) return false;
    if (!t.attachments?.media_keys?.length) return false; // media required
    if (SKIP_FILTER) return true;
    const hashtags = (t.entities?.hashtags ?? []).map((h) => h.tag.toLowerCase());
    const text = t.text.toLowerCase();
    return KEYWORDS.some((kw) => text.includes(kw) || hashtags.includes(kw));
  });

  candidates.sort((a, b) => {
    const score = (t) =>
      (t.public_metrics?.like_count ?? 0) + (t.public_metrics?.retweet_count ?? 0);
    return score(b) - score(a);
  });
  candidates = candidates.slice(0, LIMIT);

  let written = 0;
  for (const tweet of candidates) {
    const mediaKey = tweet.attachments.media_keys[0];
    const mediaObj = mediaById.get(mediaKey);
    if (!mediaObj) continue;

    let media;
    if (mediaObj.type === "photo") {
      media = { url: mediaObj.url, type: "image" };
    } else {
      const videoUrl = bestVideoUrl(mediaObj);
      if (!videoUrl) continue; // no playable variant, skip
      media = { url: videoUrl, type: "video" };
    }

    const author = usersById.get(tweet.author_id);
    const hashtags = (tweet.entities?.hashtags ?? []).map((h) => h.tag);
    const title = tweet.text.split("\n")[0].slice(0, 80);
    const slug = `${slugify(title) || "prompt"}-${tweet.id.slice(-6)}`;
    const date = (tweet.created_at ?? new Date().toISOString()).slice(0, 10);

    const frontmatter = {
      title,
      tags: hashtags,
      date,
      author: author?.username,
      tweetUrl: author ? `https://x.com/${author.username}/status/${tweet.id}` : undefined,
      tweetId: tweet.id,
      media,
    };

    const fileContent = matter.stringify(tweet.text, frontmatter);
    fs.writeFileSync(path.join(PROMPTS_DIR, `${slug}.md`), fileContent);
    written++;
    console.log(`+ ${slug}.md`);
  }

  console.log(`\nDone. Wrote ${written} new prompt${written === 1 ? "" : "s"}.`);
  if (written > 0) {
    console.log("Run `npm run build` to confirm, then commit and push.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
