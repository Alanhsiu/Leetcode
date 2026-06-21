---
title: Temporal
description: Durable execution — workflows that survive process crashes, restarts, and time.
order: 0
aiGenerated: true
tags: [overview]
---

**Temporal** is a durable-execution platform. You write ordinary-looking code
(_workflows_ and _activities_), and Temporal makes that code **fault-tolerant**:
if a worker process crashes mid-execution, the workflow resumes exactly where it
left off — with its local variables, call stack, and pending timers intact —
because Temporal persists every step to a history and replays it deterministically.

This track is a concept-first tour. It is **AI-drafted** and not yet verified — treat
it as a study outline and confirm specifics against the
[official Temporal docs](https://docs.temporal.io/).

### What you'll learn
- Why "durable execution" exists and what problem it solves.
- The core building blocks: **Workflows**, **Activities**, **Workers**, **Task Queues**.
- How retries, timeouts, signals, and queries work.
