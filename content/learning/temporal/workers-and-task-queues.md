---
title: Workers & Task Queues
description: Where your code actually executes, and how the Temporal service hands work to it.
level: Intermediate
order: 3
tags: [concepts, workers, scaling]
aiGenerated: true
---

## The service holds state; workers run code

A common surprise: the **Temporal Service** (the cluster, self-hosted or Temporal
Cloud) does **not** run your workflow or activity code. It stores histories,
schedules timers, and tracks state. Your code runs in **Workers** — long-running
processes *you* deploy that host your workflow and activity implementations.

## Task Queues route work

A **Task Queue** is a named channel. When you start a workflow you name a task
queue; workers **poll** that queue for tasks to execute and report results back.

```text
   start workflow (task queue = "payments")
                │
        ┌───────▼────────┐        poll
        │ Temporal        │◄───────────────  Worker A  (hosts payment workflows
        │ Service         │───────────────►            + activities)
        │ (history, timers)│   task/result
        └───────▲────────┘◄───────────────  Worker B  (same task queue)
                                  poll
```

Key consequences:

- **Scaling is horizontal:** run more worker processes polling the same task queue.
- **Routing:** put specialized activities (e.g. GPU jobs) on their own task queue and
  run dedicated workers for it.
- **Decoupling:** a starter doesn't call a worker directly; it enqueues work. If no
  worker is up yet, tasks wait — they aren't lost.

## A worker, conceptually

```python
# Read-only sketch. A worker registers what it can run and which queue to poll.
worker = Worker(
    client,
    task_queue="payments",
    workflows=[CheckoutWorkflow],
    activities=[charge_card, send_receipt],
)
await worker.run()  # polls "payments" forever
```

## Versioning (why it matters)

Because running workflows can live for days or months, deploying *changed* workflow
code can break replay determinism for in-flight executions. Temporal addresses this
with **Worker Versioning / patching APIs** so old histories keep replaying against
compatible logic. Treat workflow code changes as you would a database migration.

Next: making activities resilient — **Retries & Timeouts**.
