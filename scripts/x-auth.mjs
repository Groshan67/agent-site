#!/usr/bin/env node
// One-time setup: authorizes this app against YOUR X account and saves a
// refresh token to x-tokens.json (gitignored). Run again any time you need
// to re-authorize (e.g. if you change scopes).
//
// Requires env vars:
//   X_CLIENT_ID      (required)
//   X_CLIENT_SECRET  (optional — only if your X app is a "confidential" client)
//
// Usage: node scripts/x-auth.mjs

import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = path.join(__dirname, "..", "x-tokens.json");

const CLIENT_ID = process.env.X_CLIENT_ID;
const CLIENT_SECRET = process.env.X_CLIENT_SECRET; // optional
const PORT =  8787;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = ["tweet.read", "users.read", "bookmark.read","offline.access"];

if (!CLIENT_ID) {
  console.error("Missing X_CLIENT_ID env var. Get one from developer.x.com.");
  process.exit(1);
}

function base64url(input) {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const codeVerifier = base64url(crypto.randomBytes(64));
const codeChallenge = base64url(
  crypto.createHash("sha256").update(codeVerifier).digest(),
);
const state = base64url(crypto.randomBytes(16));

// const authorizeUrl = new URL("https://api.x.com/2/oauth2/authorize");
const authorizeUrl = new URL("https://x.com/i/oauth2/authorize");
authorizeUrl.searchParams.set("response_type", "code");
authorizeUrl.searchParams.set("client_id", CLIENT_ID);
authorizeUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authorizeUrl.searchParams.set("scope", SCOPES.join(" "));
authorizeUrl.searchParams.set("state", state);
authorizeUrl.searchParams.set("code_challenge", codeChallenge);
authorizeUrl.searchParams.set("code_challenge_method", "S256");

console.log("\nMake sure your X app's callback URL is registered as:");
console.log(`  ${REDIRECT_URI}\n`);
console.log("Open this URL in a browser and approve access:\n");
console.log(authorizeUrl.toString());
console.log("\nWaiting for the redirect...\n");

const server = http.createServer(async (req, res) => {
  console.log("CALLBACK RECEIVED:", req.url);

  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");

  if (!code || returnedState !== state) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Missing code or state mismatch. Close this tab and try again.");
    server.close();
    return;
  }

  try {
    const body = new URLSearchParams({
      code,
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    });

    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    if (CLIENT_SECRET) {
      headers.Authorization =
        "Basic " +
        Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
    }

    const tokenRes = await fetch("https://api.x.com/2/oauth2/token", {
      method: "POST",
      headers,
      body,
    });

    const tokenJson = await tokenRes.json();

    if (!tokenRes.ok) {
      throw new Error(`Token exchange failed: ${JSON.stringify(tokenJson)}`);
    }

    fs.writeFileSync(
      TOKENS_PATH,
      JSON.stringify(
        {
          access_token: tokenJson.access_token,
          refresh_token: tokenJson.refresh_token,
          obtained_at: new Date().toISOString(),
        },
        null,
        2,
      ),
    );

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Authorized. You can close this tab and return to the terminal.");
    console.log(`Saved tokens to ${TOKENS_PATH}`);
    console.log("You can now run: node scripts/fetch-x-prompts.mjs");
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Something went wrong — check the terminal.");
    console.error(err);
  } finally {
    server.close();
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`OAuth callback server listening on http://0.0.0.0:${PORT}`);
});
