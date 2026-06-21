---
title: Retries & Timeouts
description: How Temporal makes flaky work reliable — retry policies, the four activity timeouts, and idempotency.
level: Intermediate
order: 4
tags: [concepts, retries, timeouts, reliability]
aiGenerated: true
---

This is where durable execution pays off: you describe *policy*, and Temporal
enforces it across failures and restarts — no hand-written retry loops or cron
reconcilers.

## Retry policies

Activities retry automatically by default. You tune a **RetryPolicy**:

- **initial interval** — wait before the first retry.
- **backoff coefficient** — multiplier per attempt (e.g. 2.0 → exponential backoff).
- **maximum interval** — cap the growing delay.
- **maximum attempts** — give up after N (0 = unlimited).
- **non-retryable error types** — fail fast on errors that can't succeed on retry
  (e.g. validation errors).

```text
RetryPolicy(initial=1s, backoff=2.0, max_interval=30s, max_attempts=5)
attempt 1 → wait 1s → 2 → wait 2s → 3 → wait 4s → 4 → wait 8s → 5 → fail
```

Workflows can also have retry policies, but retries are most commonly an
**activity** concern.

## The four activity timeouts

Distinguish *queuing* from *running*:

| Timeout | Covers | Use it for |
| --- | --- | --- |
| **schedule-to-start** | time waiting in the queue before a worker picks it up | detecting under-provisioned workers |
| **start-to-close** | a single execution attempt | the expected runtime of one try (set this!) |
| **schedule-to-close** | total across all attempts incl. waits | an overall deadline |
| **heartbeat** | max gap between heartbeats | long activities — detect a stuck/dead worker fast |

Long-running activities should **heartbeat** so Temporal can fail and retry them
promptly if the worker dies, instead of waiting out a long start-to-close.

## Idempotency is your job

Temporal guarantees an activity runs **at least once**, not exactly once — a retry
can happen after the side effect partially succeeded. So activities that mutate the
world should be **idempotent**: pass an idempotency key, upsert instead of insert,
check-before-charge. Temporal handles *when* to retry; you ensure a retry is *safe*.

Next: reacting to the outside world mid-flight — **Signals & Queries** (see outline).
