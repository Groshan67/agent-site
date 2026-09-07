---
title: "The Logic Architect: Let the AI engineer its own prompt before executing"
tags: ["meta-prompting", "prompt-engineering", "self-improvement", "architecture"]
date: "2024-11-10"
author: "u_promptengineer"
tweetUrl: "https://www.reddit.com/r/PromptEngineering/comments/1rcvp4j/the_logic_architect_prompt_let_the_ai_engineer/"
tweetId: "1855123456789012481"
media: []
---

# The Logic Architect Prompt

Getting the perfect prompt on the first try is hard. Let the AI write its own instructions.

---

## The Prompt

> "I want you to [Task]. Before you start, rewrite my request into a high-fidelity system prompt with a persona and specific constraints."

---

## Why This Works

This is a massive efficiency gain. Instead of you iterating on prompts manually, you offload the prompt engineering to the model itself.

**Traditional workflow:**
1. You write a prompt
2. Test it
3. See issues
4. Rewrite prompt
5. Repeat 5-10 times

**Logic Architect workflow:**
1. You give the rough task
2. Model generates a detailed system prompt (role, constraints, format, examples, edge cases)
3. Model executes using its own generated prompt
4. If needed, you give feedback → model refines its own prompt → re-executes

---

## Example

**You:** "I want you to review this pull request for security issues."

**Model (as Logic Architect):**
> I'll first create a specialized system prompt for this task, then execute it.
>
> ---
> **Generated System Prompt:**
> You are a senior application security engineer with 10+ years of experience in code review for vulnerabilities. You specialize in OWASP Top 10, CWE categories, and language-specific security patterns.
>
> **Task:** Review the provided PR diff for security vulnerabilities.
>
> **Process:**
> 1. Analyze each changed file for: injection flaws, broken authentication, sensitive data exposure, XML external entities, broken access control, security misconfiguration, XSS, insecure deserialization, vulnerable components, insufficient logging.
> 2. For each finding: cite the exact line, name the CWE, explain the exploit scenario, provide a concrete fix.
> 3. Categorize by severity: Critical / High / Medium / Low / Informational.
> 4. Output as structured markdown with: Summary table, Detailed findings, Remediation priority.
>
> **Constraints:**
> - No false positives: only flag issues you can trace to a specific line
> - Consider context: a pattern in test code may be acceptable
> - Language-aware: apply language-specific rules (e.g., SQL injection for raw queries, XSS for template rendering)
> - If uncertain, mark as "Review Needed" with explanation
>
> ---
>
> Now executing with this prompt...

**Model (executing):** *performs the security review using the generated prompt*

---

## Variations

### For Code Generation
> "I want you to build a REST API for [spec]. Before you start, rewrite my request into a high-fidelity system prompt with a persona, architecture constraints, testing requirements, and security rules."

### For Analysis
> "I want you to analyze this dataset and find [insight]. Before you start, rewrite my request into a high-fidelity system prompt with an analyst persona, methodology constraints, and output format specifications."

### For Creative Work
> "I want you to write a [format] about [topic]. Before you start, rewrite my request into a high-fidelity system prompt with a writer persona, style guide, structure template, and quality criteria."

---

## Pro Tip: Make It a Custom GPT / Project Instruction

Create a Custom GPT (ChatGPT) or Project (Claude) with this as the system prompt:

> "You are the Logic Architect. For every user request, first generate a high-fidelity system prompt tailored to that specific task, then execute using that prompt. The generated prompt must include: persona/expertise, task decomposition, process steps, output format, constraints/anti-patterns, and quality criteria. Show the generated prompt to the user before executing, so they can approve or refine it."

Now every conversation starts with prompt engineering done right — automatically.

---

## Related

This is essentially **Recursive Meta Prompting (RMP)** in practice — the model generates and refines its own prompts. See the "Meta Prompting & Recursive Meta Prompting" prompt for the theoretical background and OpenAI's leaked meta-prompt.