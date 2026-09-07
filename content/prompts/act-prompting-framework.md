---
title: "The ACT Prompting Framework: Master AI in 3 Words"
tags: ["prompting", "framework", "act", "role", "context", "task", "ai-productivity"]
date: "2026-08-13"
author: "colinscotland"
sourceUrl: "https://colinscotland.com/the-act-prompting-framework/"
---

**The ACT Framework: Three Steps, Simple**

**A - Act as (The Role)**

The more specific the role, the better the output. Not because you're being fancy. Because you're being precise.

> Act as a [SPECIFIC ROLE] with knowledge of [SUBJECT OR RESPONSIBILITY].

**C - Context (The Why)**

Context is your guardrails. It tells AI _why_ you're asking and _who_ this is for.

> Here is the relevant context:
> [ADD THE INFORMATION, SOURCE MATERIAL, REQUIREMENTS, OR CONSTRAINTS.]

**T - Task (The What)**

This is your specific, complete instruction. Everything about format, length, style, constraints goes _in_ the task. Not as a separate step.

> Your task is to [SPECIFIC TASK].
> 
> Present the response as [FORMAT].
> 
> Follow these boundaries:
> - [BOUNDARY]
> - [BOUNDARY]
> - [BOUNDARY]
> 
> Do not invent missing information. Clearly identify assumptions and anything that requires confirmation.
> 
> Ask me for essential missing information before beginning. If the task requires several stages, complete one stage at a time and wait for my approval before continuing.

**Reusable Template**

```
Act as a [SPECIFIC ROLE] with knowledge of [SUBJECT OR RESPONSIBILITY].

Your task is to [SPECIFIC TASK].

My goal is to [DESIRED OUTCOME].

Here is the relevant context:

[ADD THE INFORMATION, SOURCE MATERIAL, REQUIREMENTS, OR CONSTRAINTS.]

Present the response as [FORMAT].

Follow these boundaries:

- [BOUNDARY].
- [BOUNDARY].
- [BOUNDARY].

Do not invent missing information. Clearly identify assumptions and anything that requires confirmation.

Ask me for essential missing information before beginning. If the task requires several stages, complete one stage at a time and wait for my approval before continuing.
```

**Practical Example: Debugging Partner**

```
Act as a debugging partner for a developer working with [LANGUAGE AND FRAMEWORK].

Help me determine why the code below produces [ACTUAL BEHAVIOR] instead of [EXPECTED BEHAVIOR].

First, identify the most likely causes. Second, explain how to test each cause. Third, recommend the smallest safe correction. Do not rewrite unrelated parts of the code.

State any assumptions about versions, dependencies, or the operating environment. If you need an error log or configuration, ask for it before giving a final recommendation.

Provide the proposed code change in one code block with validation steps.

[PASTE CODE.]
```

**Why ACT Works**

The framework's name is also its first instruction: **Act as.** Three steps — Role, Context, Task — that you can hold in your head while in flow. Built for people who use AI to do actual work: coaching clients, writing content, building strategy, solving problems.