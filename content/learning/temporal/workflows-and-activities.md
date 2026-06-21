---
title: Workflows & Activities
description: The two core building blocks — the deterministic orchestrator and the side-effecting units it calls.
level: Beginner
order: 2
tags: [concepts, workflows, activities]
aiGenerated: true
---

Temporal splits your logic into two kinds of code with very different rules.

## Workflows — the durable orchestrator

A **Workflow** is the long-lived coordinator. It decides *what happens and in what
order*: call this, wait for that, retry on failure, sleep for a day, then continue.
Its state (variables, position in the code) is **durable** — it survives worker
crashes and restarts via history replay.

Because Temporal reconstructs workflow state by **replaying** its history, workflow
code must be **deterministic**: given the same history, it must make the same
decisions every time. That means **no direct** non-determinism in a workflow:

- ❌ `datetime.now()`, random numbers, UUIDs
- ❌ direct network/database/file calls
- ❌ reading mutable global state, threads

Instead, the workflow uses deterministic SDK equivalents (e.g. a workflow-safe
clock and sleep) and delegates everything non-deterministic to **activities**.

## Activities — the side effects

An **Activity** is a plain function that does the real, non-deterministic work:
call an API, charge a card, write to a DB, send an email. Activities **can** fail;
Temporal records their *result* in history, so on replay the workflow reuses the
recorded result instead of re-running the side effect.

```text
Workflow (deterministic)            Activity (anything goes)
──────────────────────              ───────────────────────
order = start                       charge_card(order)   → calls Stripe
result = await charge_card(order)   send_receipt(order)  → calls email API
await send_receipt(order)           reserve_stock(order) → writes DB
```

## The mental rule

> **Workflow = decisions (deterministic, durable). Activity = effects (retryable,
> recorded).** If it talks to the outside world or is non-deterministic, it belongs
> in an activity.

Next: how this code actually runs — **Workers & Task Queues**.
