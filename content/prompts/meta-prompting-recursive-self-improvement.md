---
title: "Meta Prompting & Recursive Meta Prompting: Let the AI engineer its own prompts"
tags: ["prompt-engineering", "meta-prompting", "recursive", "self-improvement", "architecture"]
date: "2024-10-02"
author: "philschmid"
tweetUrl: "https://x.com/amebagpt/status/1841177927569838519"
tweetId: "1841177927569838519"
media: []
---

# OpenAI's Leaked Meta-Prompt (System Prompt for Prompt Engineering)

This is the actual meta-prompt OpenAI uses internally to generate and improve system prompts. It was leaked via X/Twitter.

---

## The Meta-Prompt

```
Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.

- Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.

- Reasoning Before Conclusions: Encourage reasoning steps before any conclusions are reached. ATTENTION! If the user provides examples where the reasoning happens afterward, REVERSE the order! NEVER START EXAMPLES WITH CONCLUSIONS!
    - Reasoning Order: Call out reasoning portions of the prompt and conclusion parts (specific fields by name). For each, determine the ORDER in which this is done, and whether it needs to be reversed.
    - Conclusion, classifications, or results should ALWAYS appear last.

- Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
   - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.

- Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.

- Formatting: Use markdown features for readability. DO NOT USE ``` CODE BLOCKS UNLESS SPECIFICALLY REQUESTED.

- Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.

- Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.

- Output Format: Explicitly the most appropriate output format, in detail. This should include length and syntax (e.g. short sentence, paragraph, JSON, etc.)
    - For tasks outputting well-defined or structured data (classification, JSON, etc.) bias toward outputting a JSON.
    - JSON should never be wrapped in code blocks (```) unless explicitly requested.

The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

[Concise instruction describing the task - this should be the first line in the prompt, no section header]

[Additional details as needed.]

[Optional sections with headings or bullet points for detailed steps.]

# Steps [optional]

[optional: a detailed breakdown of the steps necessary to accomplish the task]

# Output Format

[Specifically call out how the output should be formatted, be it response length, structure e.g. JSON, markdown, etc]

# Examples [optional]

[Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]

[If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

# Notes [optional]

[optional: edge cases, details, and an area to call or repeat out specific important considerations]
```

---

## How to Use This Meta-Prompt

1. **Paste this entire block** as a system prompt to a strong model (GPT-4, Claude 3.5 Sonnet, o1)
2. **Then give it your task** — e.g., "Create a system prompt for a senior code reviewer that asks clarifying questions before giving feedback"
3. **The model will output** a fully structured, optimized system prompt following the template above

---

## Recursive Meta Prompting (RMP) — The Next Level

From the paper "Meta Prompting" (Zhang et al., 2024): Meta Prompting prioritizes **form and structure over content**. Instead of few-shot examples, you give a **structural template** that teaches the model *how to think*.

**Meta-Meta-Prompt Example:**

> "I want you to [Task]. Before you start, rewrite my request into a high-fidelity system prompt with a persona and specific constraints."

This creates a self-improvement loop:
1. You describe the task
2. The model generates a structured prompt for that task
3. You test it, give feedback
4. The model refines its own prompt
5. Repeat until the output is reliable

**Key insight:** The model becomes its own prompt engineer. This mirrors metaprogramming — a program that treats other programs (or itself) as data to be analyzed and modified.

---

## Practical RMP Workflow

```
You: "I need a prompt that converts messy meeting transcripts into structured action items with owners and deadlines."

Model (as prompt engineer): *generates a detailed system prompt with role, steps, format, examples, constraints*

You: *test it on a real transcript* "The output missed the deadline format. Also need to flag blocked items."

Model: *refines its own prompt* "Updated: added explicit date parsing rules, added 'blocked' status flag, added validation step..."

You: *test again* → works reliably
```

---

## Why This Matters

- **Token efficiency:** Structure-only prompts use far fewer tokens than few-shot
- **Fair comparison:** Zero-shot structural approach enables equitable model evaluation
- **Self-improvement:** The model learns to optimize its own instructions
- **Portability:** The generated prompts work across different models

---

## Related: Dan Shipper's Meta-Prompting Tool

Dan Shipper (Every.to) built a meta-prompter tool that parametrizes and versions meta-prompts, including documentation crawling. See: https://gist.github.com/disler/29ff18823670098c26fa370ad802fa96