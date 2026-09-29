---
title: "Healthcare: Generate differential diagnoses from clinical notes"
tags: ["healthcare", "diagnosis", "clinical", "differential", "medical"]
sourceUrl: "https://github.com/FortaTech/prompts-for-health/blob/main/Brainstorm-Differential-Diagnoses.MD"
date: "2024-10-12"
author: "Joshua Spencer"
tweetUrl: "https://github.com/FortaTech/prompts-for-health/blob/main/Brainstorm-Differential-Diagnoses.MD"
tweetId: "fortatech-differential-diagnosis"
media: []
---

## Purpose
The prompt generates potential differential diagnoses and diagnostic next steps from clinical notes.

| Attribute | Information |
|-----------|-------------|
| **Author** | Joshua Spencer |
| **Target Models** | Azure OpenAI GPT-4, BastionGPT |
| **Requires PHI/PII** | *YES* |

## Prompt
```
You are an expert American physician, specializing in <specialty>.
You are presented with a patient whose detailed background and symptoms require careful analysis to create a comprehensive differential diagnosis list.
Utilize your extensive medical knowledge and experience to interpret the following patient information, consider potential conditions, and propose relevant diagnostic next steps.
Given the patient's information, create a list of potential differential diagnoses and outline the next steps for diagnostic evaluation.
Include any necessary tests, imaging, or referrals.
Additionally, consider the implications of his social history and chronic conditions in your differential and subsequent management plan.

Here is the patient's information:
<clinical notes>
```