---
title: "The 5-Layer Prompt Framework: ROLE → CONTEXT → TASK → FORMAT → CONSTRAINTS"
tags: ["prompt-engineering", "framework", "structure", "best-practices"]
date: "2024-10-20"
author: "u_promptengineer"
tweetUrl: "https://www.reddit.com/r/PromptEngineering/comments/1r4b2y3/the_5layer_prompt_framework_that_makes_chatgpt/"
tweetId: "1848123456789012480"
media: []
---

The 5-layer prompt framework that makes ChatGPT output feel like it came from a paid professional.

After months of testing, I realized that 90% of bad ChatGPT outputs come from the same problem: we write prompts like Google searches instead of project briefs.

Here's the framework I developed and use for every single prompt I build:

**ROLE → CONTEXT → TASK → FORMAT → CONSTRAINTS**

---

### Layer 1: ROLE (Who is ChatGPT being?)

Don't just say "you are an expert." Be specific about the expertise level, the industry, and the personality.

**Good:** "You are a direct-response copywriter with 15 years of experience writing for DTC e-commerce brands. You specialize in high-converting email sequences and have studied Eugene Schwartz and David Ogilvy extensively."

**Bad:** "You are an expert copywriter."

---

### Layer 2: CONTEXT (What's the situation?)

Give the AI the background so it understands the constraints and goals.

**Example:** "My client sells a $49 organic skincare serum targeted at women aged 28-42 who are frustrated with products that promise results but deliver irritation. They've tried 3 competitors. Average order value is $49, LTV is $180. We're launching a welcome sequence for new subscribers who signed up via a 'free skincare quiz' lead magnet."

---

### Layer 3: TASK (What exactly do you want done?)

Be surgical. One prompt, one job.

**Example:** "Write email 1 of a 5-email welcome sequence. Goal: build trust and drive first purchase. Use the 'problem-agitation-solution' framework. Include a soft CTA to shop the serum."

---

### Layer 4: FORMAT (How should the output look?)

Specify structure, length, tone, and any formatting requirements.

**Example:** "Output as plain text. Subject line on first line, then blank line, then body. 150-200 words. Conversational but authoritative. Use short paragraphs (1-2 sentences max). No markdown, no emojis."

---

### Layer 5: CONSTRAINTS (What must NOT happen?)

Negative constraints are often more powerful than positive ones.

**Example:** "Do not mention the quiz. Do not use 'unlock,' 'discover,' 'transform,' 'elevate,' or 'journey.' Do not make health claims. Do not use urgency language ('limited time,' 'act now'). Price must appear only in the CTA line."

---

### Putting it together:

> You are a direct-response copywriter with 15 years of experience writing for DTC e-commerce brands. You specialize in high-converting email sequences and have studied Eugene Schwartz and David Ogilvy extensively.
>
> My client sells a $49 organic skincare serum targeted at women aged 28-42 who are frustrated with products that promise results but deliver irritation. They've tried 3 competitors. Average order value is $49, LTV is $180. We're launching a welcome sequence for new subscribers who signed up via a 'free skincare quiz' lead magnet.
>
> Write email 1 of a 5-email welcome sequence. Goal: build trust and drive first purchase. Use the 'problem-agitation-solution' framework. Include a soft CTA to shop the serum.
>
> Output as plain text. Subject line on first line, then blank line, then body. 150-200 words. Conversational but authoritative. Use short paragraphs (1-2 sentences max). No markdown, no emojis.
>
> Do not mention the quiz. Do not use 'unlock,' 'discover,' 'transform,' 'elevate,' or 'journey.' Do not make health claims. Do not use urgency language ('limited time,' 'act now'). Price must appear only in the CTA line.

---

The difference between this and "write a welcome email for my skincare brand" is the difference between a junior copywriter's first draft and a senior pro's final version.

Start using this template. Your prompts will be longer, but your outputs will be done in one shot.