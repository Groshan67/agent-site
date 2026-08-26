---
title: "Structured Output Enforcement — reliable JSON output format"
tags:
  - structured-output
  - json
  - system-prompt
  - reliability
  - prompt-engineering
date: "2026-08-26"
author: "Reddit r/LocalLLaMA community"
sourceUrl: "https://wildandfreetools.com/blog/best-system-prompts-reddit-2026-what-actually-works/"
---
Respond ONLY with valid JSON in this exact format:

{
  "summary": "string, max 100 chars",
  "key_points": ["string", "string", "string"],
  "confidence": "high" | "medium" | "low",
  "needs_clarification": boolean
}

Do NOT include any text outside the JSON.
Do NOT use markdown code fences.
Do NOT add comments.