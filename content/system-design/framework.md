---
title: A framework for the interview
description: A repeatable, time-boxed structure for a 45-minute system-design round.
level: Beginner
order: 1
aiGenerated: true
tags: [framework, process]
---

Most strong answers follow the same arc. Treating it as a checklist keeps you from
freezing on a blank whiteboard and signals seniority.

## 1. Clarify & scope (≈5 min)

Don't design yet. Pin down what you're building:

- **Functional requirements** — what must it *do*? Pick the 2–3 core use cases and
  explicitly defer the rest ("I'll skip notifications for now").
- **Non-functional requirements** — availability, latency, consistency, durability. These
  drive every later trade-off, so surface them early.
- **Scale** — users, reads/writes per second, data volume, read:write ratio. Estimate
  rather than wait to be told.

## 2. Back-of-the-envelope (≈5 min)

Turn scale into numbers that constrain the design: QPS, storage per year, bandwidth.
A rough "≈10k writes/s, ≈100k reads/s, ≈50 TB/year" tells you immediately that you need
caching, replication, and partitioning — and gives you something concrete to design *to*.

## 3. API & data model (≈5 min)

Sketch the handful of endpoints (`POST /messages`, `GET /feed?cursor=…`) and the core
entities. This grounds the rest of the discussion in something concrete.

## 4. High-level design (≈10 min)

Draw the boxes: clients → load balancer → stateless services → datastores, with a cache
and a queue where they earn their place. Walk one **write** path and one **read** path
end to end. Keep services stateless so they scale horizontally.

## 5. Deep dive & bottlenecks (≈10 min)

The interviewer will steer you here, or you pick the riskiest piece: the hot partition,
the consistency boundary, the cache-invalidation story. Name the bottleneck, then a
mitigation, then the new trade-off it introduces.

## 6. Wrap up (≈5 min)

Summarize, call out what you'd monitor, and name what you deliberately left out. Ending
with "here's what I'd revisit with more time" reads as maturity, not as a gap.

## The one habit that matters

**Narrate the trade-off, not just the choice.** "I'd use a CDN here to cut read latency,
at the cost of staleness up to the TTL" beats "I'd add a CDN" every time.
