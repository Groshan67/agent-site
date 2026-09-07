---
title: "ReAct Prompting: Reasoning + Acting for AI Agents"
tags: ["react", "prompting", "ai-agents", "reasoning", "tool-use", "langchain", "claude-code"]
date: "2026-06-27"
author: "yashthakker"
sourceUrl: "https://explainx.ai/blog/react-prompting-reasoning-acting-agents-guide-2026"
---

**ReAct System Prompt Template**

```
You are an AI assistant that can use tools to answer questions.

You have access to the following tools:
- web_search(query: str) -> str: Search the web and return relevant results
- read_url(url: str) -> str: Read the content of a webpage
- calculator(expression: str) -> float: Evaluate a math expression

Use the following format EXACTLY:

Thought: [Your reasoning about what to do next]
Action: [tool_name(parameters)]
Observation: [The result of the action — this will be filled in for you]

Repeat Thought/Action/Observation as many times as needed.

When you have enough information to answer, write:
Final Answer: [Your complete answer to the user's question]

Rules:
- Always write a Thought before every Action
- Never make up an Observation — wait for the real result
- Stop as soon as you have enough information
- If a tool returns an error, try a different approach
```

**Key Principles**

- **Thought**: The model reasons about the current state — what it knows, what it needs, what the best next action is
- **Action**: The model specifies a concrete tool call with parameters
- **Observation**: The tool result comes back, appended to context
- The loop runs until the model produces a Final Answer or hits the iteration limit

**When to Use ReAct**

- Tasks requiring current information (web search, APIs)
- Tasks requiring multi-step execution (write code, run tests, fix failures)
- Tasks requiring reading/writing files or databases
- Tasks where intermediate state needs to be verified

**When NOT to Use ReAct**

- If the model could answer correctly with no tools and no loop — don't use ReAct

**Failure Modes to Prevent**

1. **Hallucinated observations** — The orchestrating loop should insert Observations, not the model. Parse everything after `Action:` and inject real tool output as `Observation:` before continuing.

2. **Infinite loops** — Add a maximum iteration count (10 is usually enough). Add a rule: "If a tool returns no results, try a different query or approach, or acknowledge that information is not available."

3. **Format parsing errors** — Use JSON format for programmatic parsing, or label-based format (Thought:/Action:/Observation:) for readability.