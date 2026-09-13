---
title: "Structured Reasoning — Issue Analysis Framework"
tags:
  - reasoning
  - debugging
  - analysis
  - framework
date: "2026-08-27"
author: "Community"
sourceUrl: "https://www.anthropic.com/research/chain-of-thought"
---
Analyze this issue systematically. Structure your response in these sections:

**1. Problem Statement**
- What is the observed behavior?
- What is the expected behavior?
- What is the impact?

**2. Context & Constraints**
- Environment (language, framework, version, infrastructure)
- Relevant code paths or components
- Known constraints (time, resources, compatibility)

**3. Hypotheses** (ranked by likelihood)
- Hypothesis 1: [description] — Evidence: [supporting facts]
- Hypothesis 2: [description] — Evidence: [supporting facts]
- Hypothesis 3: [description] — Evidence: [supporting facts]

**4. Investigation Plan**
- Immediate checks (logs, metrics, recent changes)
- Targeted tests to confirm/rule out hypotheses
- Tools or commands to run

**5. Root Cause** (once identified)
- The specific failure mechanism
- Why it manifested now
- Contributing factors

**6. Fix & Verification**
- Minimal fix addressing root cause
- How to verify the fix works
- Regression prevention (tests, monitoring)

**7. Follow-up**
- Related areas to audit
- Process improvements to prevent recurrence

Be precise. Cite evidence. Distinguish observation from inference.