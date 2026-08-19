---
title: "Stop prompting agents — design loops that prompt your agents"
tags:
  - loop-engineering
  - agents
  - prompt-engineering
  - claude-code
  - coding
date: "2026-06-07"
author: "steipete"
tweetUrl: "https://x.com/steipete/status/2063697162748260627"
sourceUrl: "https://x.com/steipete/status/2063697162748260627"
tweetId: "2063697162748260627"
---
Here's your monthly reminder that you shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents.

The reply thread that followed seeded "loop engineering": you stop being the person typing prompts and start building a small system that finds the work, hands it out, checks the result, and re-prompts the agent until it's done. The on-ramps are Claude Code's `/loop` and Codex automations; anchor each run with a `VISION.md` so intent survives, and give the loop something that can say no — a test, a type check, a review gate.
