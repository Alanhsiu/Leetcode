---
title: Cloud Run — Serverless Containers
description: Deploy a container and get a scaling HTTPS endpoint, scale-to-zero, and pay-per-use.
level: Beginner
order: 1
tags: [compute, serverless, containers]
aiGenerated: true
---

## Mental model

**Cloud Run** runs a **container** for you and gives it an autoscaling HTTPS
endpoint. You hand it an image that listens on the port in `$PORT`; Cloud Run
handles TLS, load balancing, and scaling — including **scale to zero** (you pay
only while requests are being served). It's the fastest way to get a stateless web
service or API onto GCP without managing servers or a Kubernetes cluster.

Reach for Cloud Run when: the workload is **request-driven and stateless**, you
already have (or can write) a `Dockerfile`, and you want minimal ops. Reach for
**GKE** instead when you need fine-grained control, long-lived workloads, or
complex networking.

## Deploy from source

Cloud Run can build the container for you (via Buildpacks/Cloud Build) — no
`Dockerfile` required for common runtimes:

```bash
# Deploy the current directory; Cloud Run builds + runs it.
gcloud run deploy my-service \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## Deploy a prebuilt image

```bash
gcloud run deploy my-service \
  --image us-docker.pkg.dev/PROJECT_ID/repo/my-image:latest \
  --region us-central1 \
  --allow-unauthenticated \
  --max-instances 10 \
  --memory 512Mi
```

## Your container's contract

Listen on the port Cloud Run injects via `$PORT` (default 8080):

```python
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Hello from Cloud Run\n")

port = int(os.environ.get("PORT", 8080))
HTTPServer(("", port), Handler).serve_forever()
```

## Useful follow-ups

```bash
# Stream logs
gcloud run services logs read my-service --region us-central1

# Send 100% of traffic to the latest revision
gcloud run services update-traffic my-service --to-latest --region us-central1
```

> **Cost intuition:** with scale-to-zero, an idle service costs ~nothing; you pay
> for vCPU/memory only while a request is in flight (plus a small per-request fee).
> Set `--max-instances` to cap blast radius and runaway cost.
