---
title: Cloud Storage — Object Storage
description: Buckets, objects, storage classes, signed URLs, and lifecycle rules.
level: Beginner
order: 4
tags: [storage, objects, buckets]
aiGenerated: true
---

## Mental model

**Cloud Storage** is object storage: you put **objects** (files of any size) into
globally-named **buckets**. It's the default home for blobs — images, backups, data
files, static assets, ML datasets. Objects are immutable; you overwrite to "edit".

## Storage classes (cost vs access)

Pick a class by how often you'll read the data:

| Class | For | Note |
| --- | --- | --- |
| **Standard** | hot, frequently accessed | highest storage cost, no retrieval fee |
| **Nearline** | ~monthly access | cheaper storage, small retrieval fee, 30-day min |
| **Coldline** | ~quarterly | 90-day min |
| **Archive** | rarely (DR, compliance) | cheapest storage, highest retrieval fee, 365-day min |

**Lifecycle rules** automate transitions ("move to Coldline after 30 days, delete
after 365"), so you don't pay hot prices for cold data.

## Commands (read-only)

```bash
# Buckets are globally unique; pick a region close to compute.
gcloud storage buckets create gs://my-unique-bucket --location us-central1

gcloud storage cp ./report.pdf gs://my-unique-bucket/
gcloud storage ls gs://my-unique-bucket/
gcloud storage cp gs://my-unique-bucket/report.pdf ./
```

## Sharing without making data public

Prefer a time-limited **signed URL** over making an object public:

```bash
# Grants temporary read access to one object (needs a service-account key).
gcloud storage sign-url gs://my-unique-bucket/report.pdf --duration 1h
```

> **Don't make buckets public by default.** Use signed URLs for temporary sharing and
> IAM for durable access; reserve public access for genuinely public assets.
