---
title: "The Gauntlet Loop — build anything against a real-world quality bar"
tags:
  - agents
  - prompt-engineering
  - claude-code
  - loop
  - coding
date: "2026-07-27"
author: "mattshumer_"
tweetUrl: "https://x.com/mattshumer_/status/2081830214384886228"
sourceUrl: "https://x.com/mattshumer_/status/2081830214384886228"
tweetId: "2081830214384886228"
---
I'm officially calling this the Gauntlet Loop.

The agent (not you!!) breaks the goal into parts, gives each part a specialist builder and a ruthless blind critic sub-agent, with a mandate to only pass if the generated artifact is better than some real-world equivalent.

Prompt:

I want you to build a first-person shooter at the level of the most recent Call of Duty games. It should be utterly perfect, visually beautiful, with every single thing done at AAA quality—from textures to physics to anything you could think of.

Fan out sub-agents and have sub-agents tackle each one individually so that the game is utterly perfect. You should /loop on each item and have a separate sub-agent check it visually to ensure it looks triple A. That separate sub-agent should be a really harsh critic, and if it doesn't look triple A, it should keep going.

Don't stop until each sub-agent is utterly wowed with the quality when compared with the actual Call of Duty game. It should literally compare them side by side blind and say which one looks better. Do this in ThreeJS. /loop until it's utterly perfect. Fan out sub-agents and ultracode.