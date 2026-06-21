---
title: Building blocks
description: The reusable components that show up in almost every design, and when to reach for each.
level: Beginner
order: 2
aiGenerated: true
tags: [components, scalability]
---

A handful of components recur across nearly every design. Knowing what each *buys* you —
and what it *costs* — lets you assemble an answer quickly and defend it.

## Load balancer
Spreads traffic across stateless service instances and removes single points of failure.
Layer 4 (TCP) is fast and simple; Layer 7 (HTTP) can route by path/host and terminate TLS.
**Cost:** another hop and a thing to make highly available itself.

## Cache
Keeps hot data close to compute (in-process, or a shared tier like Redis/Memcached) to cut
read latency and database load. The hard part is **invalidation**: pick a strategy
(write-through, write-back, TTL) and state the staleness you accept.

## Database: SQL vs NoSQL
- **Relational** when you need transactions, joins, and strong consistency — and the
  schema is fairly stable.
- **NoSQL** (key-value, document, wide-column) when you need horizontal write scale and a
  flexible schema, and can live with eventual consistency and denormalized data.

Lead with the access pattern, not the brand name.

## Replication & partitioning
- **Replication** (copies of the data) buys read scale and fault tolerance. Single-leader
  is simplest; multi-leader/leaderless trade consistency for availability.
- **Partitioning / sharding** (splitting the data) buys write scale and storage beyond one
  node. The whole game is choosing a shard key that avoids hot spots.

## Message queue
Decouples producers from consumers, absorbs traffic spikes, and enables async work
(Kafka, SQS, RabbitMQ). It turns a synchronous call into a durable, retryable job — at the
cost of eventual consistency and more moving parts.

## CDN
Serves static (and cacheable dynamic) content from edge locations near users. Huge latency
win for global audiences; watch cache invalidation and per-request cost.

## Tying it together with CAP

Under a network partition you must choose between **consistency** and **availability**.
Most large systems favor availability and design for *eventual* consistency, reserving
strong consistency for the few operations that truly need it (payments, inventory). Saying
*where* you draw that line is most of the interview.
