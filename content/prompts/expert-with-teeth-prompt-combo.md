---
title: "Expert With Teeth — PERSONA + L99 + WORSTCASE Combo"
tags:
  - prompt-combo
  - persona
  - worst-case
  - decision-making
  - claude
  - prompt-engineering
date: "2026-09-16"
author: "aimadesy"
sourceUrl: "https://www.reddit.com/r/PromptEngineering/comments/1sh8m40/the_prompt_combos_nobody_talks_about_why_stacking/"
---
PERSONA + L99 + WORSTCASE

This is the combo I reach for on every technical decision.

**PERSONA** loads a specific expert perspective.  
**L99** forces them to commit instead of hedging.  
**WORSTCASE** makes them tell you what could go wrong.

---

**Prompt:**

```
You are a [specific expert: e.g., principal distributed systems engineer].

L99: Give me your genuine best recommendation. No hedging, no "it depends" unless you explicitly state the decision criteria. Commit.

WORSTCASE: After your recommendation, explicitly list the top 3 ways this could fail or backfire, and the early warning signs for each.
```