---
title: "Generate GitLab CI Templates"
tags: ["gitlab", "ci-cd", "devops", "pipeline", "security", "deployment"]
sourceUrl: "https://github.com/BELYAGOUBIABDELILAH/open-prompt-library"
date: "2026-01-15"
author: "open-prompt-library"
---

Create a reusable GitLab CI/CD pipeline template for: [PROJECT TYPE / USE CASE]

The template must include:

## Pipeline Structure
- Stages: build → test → security → deploy
- Rules/conditions to skip stages appropriately
- Caching strategy for dependencies
- Artifact passing between stages

## Security Scanning
Include these GitLab Auto DevOps security jobs (or equivalents):
- SAST (Static Application Security Testing)
- Secret detection
- Dependency scanning
- Container scanning (if applicable)

## Deployment Strategy
Support these environments:
- Review apps (on MR creation)
- Staging (on merge to main)
- Production (manual approval gate)

## Reusability
- Use YAML anchors or !reference to avoid duplication
- Parameterize with variables (DOCKER_IMAGE, DEPLOY_ENV, etc.)
- Add a README block at the top explaining how to include this template

Technology stack: [SPECIFY]
Deployment target: [Kubernetes / Docker / VM / Serverless]