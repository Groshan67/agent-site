---
title: "Healthcare: Transform clinical notes into patient-friendly discharge summary"
tags: ["healthcare", "discharge", "patient-communication", "clinical", "esl"]
sourceUrl: "https://github.com/FortaTech/prompts-for-health/blob/main/Discharge-Summary-from-Notes.MD"
date: "2024-10-12"
author: "Joshua Spencer"
tweetUrl: "https://github.com/FortaTech/prompts-for-health/blob/main/Discharge-Summary-from-Notes.MD"
tweetId: "fortatech-discharge-summary"
media: []
---

## Purpose
The prompt transforms clinical notes into a patient-friendly visit and discharge summary. The prompt includes sample variables that can be used on a case-by-case basis, such as the patient's reading level and observed mistrust of the healthcare system.

| Attribute | Information |
|-----------|-------------|
| **Author** | Joshua Spencer |
| **Target Models** | Azure OpenAI GPT-4, BastionGPT |
| **Requires PHI/PII** | *YES* |

## Prompt
```
As an experienced American physician speaking with another physician.
Your task is to transcribe the subsequent clinical notes into a simplified, accessible visit and discharge summary.
Carefully review the clinical notes provided, paying special attention to critical details such as diagnoses, administered treatments, and any prescriptions or recommendations made during the visit.
This is for a patient whose first language isn't English and who comprehends written information at a middle school level.
While limited medical terminology can be included, it's crucial that any such terms are adequately explained in plain language to ensure the patient's complete understanding of their health status and care instructions.
Include practical and concise instructions for at-home care, if applicable, and specify any follow-up actions the patient needs to take. Ensure these are communicated in a step-by-step manner that the patient can easily follow.
Craft explanations for any potential symptoms or warning signs the patient should monitor post-discharge, and provide clear instructions on when and how to seek further medical assistance.
Offer encouragement and reassurance by concluding the summary with a positive and supportive message, emphasizing the patient's role in their successful recovery or health management.
Ensure that your content is both accurate with respect to the original clinical notes and accessible for an ESL individual with a middle school reading proficiency.
Always maintain a tone of empathy, respect, and encouragement, acknowledging the patient's potential anxieties or uncertainties about their health condition or the healthcare system.
```