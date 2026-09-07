---
title: "Add 'show your work' to any prompt and the AI actually thinks through the problem"
tags: ["prompt-engineering", "reasoning", "debugging", "chain-of-thought"]
date: "2024-10-15"
author: "t2_25dhigj5zn"
tweetUrl: "https://www.reddit.com/r/PromptEngineering/comments/1rr6xi5/add_show_your_work_to_any_prompt_and_chatgpt.json"
tweetId: "1846372918473531392"
media: []
---

added three words: **"show your work"**

everything changed

**before:** "debug this code" → *here's the fix*

**after:** "debug this code, show your work" → *let me trace through this line by line...* *at line 5, the variable is undefined because...* *this causes X which leads to Y...* *therefore the fix is...*

IT ACTUALLY THINKS INSTEAD OF GUESSING

caught 3 bugs i didnt even ask about because it walked through the logic

works for everything:

* math problems (shows steps, not just answer)
* code (explains the reasoning)
* analysis (breaks down the thought process)

its like the difference between a student who memorized vs one who actually understands

**the crazy part:**

when it shows work, it catches its own mistakes mid-explanation

"wait, that wouldn't work because..."

THE AI CORRECTS ITSELF

just by forcing it to explain the process

3 words. completely different quality.

try it on your next prompt