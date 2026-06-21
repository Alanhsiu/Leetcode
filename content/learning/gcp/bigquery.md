---
title: BigQuery — Serverless Data Warehouse
description: Petabyte-scale SQL with no servers — datasets, tables, pricing models, and partitioning.
level: Beginner
order: 6
tags: [data, analytics, sql, warehouse]
aiGenerated: true
---

## Mental model

**BigQuery** is a serverless, columnar data warehouse: you load (or stream) data and
run **SQL** over it at scale, with no clusters to manage. Storage and compute are
separate — you store cheaply and pay for compute only when a query runs. It's built
for **analytics** (scan/aggregate huge tables), not for high-QPS transactional reads.

**Hierarchy:** Project → **Dataset** (a namespace, tied to a location) → **Table**.

## Pricing — the part that bites

- **On-demand:** pay per **bytes scanned** by each query. Because BigQuery is
  columnar, `SELECT *` scans every column — **select only the columns you need**.
- **Capacity (slots):** buy reserved compute for predictable/heavy workloads.

Two habits cut on-demand cost dramatically:

- **Partitioning** (e.g. by date) → queries prune to relevant partitions.
- **Clustering** (by frequently-filtered columns) → less data scanned within partitions.

## Commands (read-only)

```bash
bq mk --dataset --location=US PROJECT_ID:analytics

# Load newline-delimited JSON, autodetecting the schema
bq load --autodetect --source_format=NEWLINE_DELIMITED_JSON \
  analytics.events ./events.json
```

```bash
# Query — scans only the columns referenced
bq query --use_legacy_sql=false \
  'SELECT user_id, COUNT(*) AS n
   FROM `PROJECT_ID.analytics.events`
   WHERE event_date = "2026-06-01"
   GROUP BY user_id
   ORDER BY n DESC
   LIMIT 10'
```

> **Cost reflex:** never `SELECT *` on a big table; filter on the partition column;
> use the dry-run/estimator to see bytes scanned before running an expensive query.
