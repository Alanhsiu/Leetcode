---
title: Pub/Sub — Asynchronous Messaging
description: Decouple producers from consumers with topics, subscriptions, delivery guarantees, and dead-letter queues.
level: Beginner
order: 3
tags: [messaging, eventing, async]
aiGenerated: true
---

## Mental model

**Pub/Sub** is a fully managed message bus. Producers **publish** messages to a
**topic**; consumers receive them via a **subscription**. Producers and consumers are
fully decoupled — they don't know about each other, scale independently, and a slow
consumer doesn't block the producer.

```text
publisher ─▶ TOPIC ─┬─▶ subscription A ─▶ worker(s)   (e.g. process order)
                    └─▶ subscription B ─▶ worker(s)   (e.g. analytics)
```

Each subscription gets its **own copy** of every message — add a subscription to
fan a topic out to a new consumer without touching the producer.

## Delivery model — know these

- **At-least-once** delivery by default: a message can be redelivered, so consumers
  must be **idempotent**. (Exactly-once delivery is available with constraints.)
- **Pull vs Push:** *pull* = your worker fetches and acks; *push* = Pub/Sub POSTs to
  an HTTPS endpoint (e.g. a Cloud Run service).
- **Ordering keys:** opt-in in-order delivery for messages sharing a key.
- **Dead-letter topic:** after N failed deliveries, route the message aside so one
  poison message doesn't retry forever.

## Commands (read-only)

```bash
gcloud pubsub topics create orders
gcloud pubsub subscriptions create orders-worker --topic orders --ack-deadline 30
gcloud pubsub topics publish orders --message '{"id":123}'
gcloud pubsub subscriptions pull orders-worker --auto-ack --limit 5
```

```bash
# Dead-letter after 5 delivery attempts
gcloud pubsub subscriptions create orders-worker \
  --topic orders \
  --dead-letter-topic orders-dlq \
  --max-delivery-attempts 5
```

> **Design for redelivery and out-of-order by default.** Make handlers idempotent;
> add ordering keys only when you truly need order (it limits throughput).
