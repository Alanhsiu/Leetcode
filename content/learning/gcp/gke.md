---
title: GKE — Managed Kubernetes
description: When to choose Kubernetes over Cloud Run, and Autopilot vs Standard clusters.
level: Intermediate
order: 2
tags: [compute, kubernetes, containers]
aiGenerated: true
---

## Mental model

**Google Kubernetes Engine (GKE)** is managed Kubernetes: Google runs the control
plane; you run workloads on nodes. Choose GKE over **Cloud Run** when you need what
full Kubernetes gives you — stateful workloads, DaemonSets, custom networking/service
mesh, GPUs with fine control, operators, or many cooperating services — and you're
willing to take on cluster-level concepts.

**Autopilot vs Standard:**

- **Autopilot** — Google manages nodes; you pay per pod resource request. Less ops,
  fewer footguns. Good default.
- **Standard** — you manage node pools, sizes, autoscaling. Maximum control, more ops.

## Create a cluster and connect

```bash
# Autopilot cluster
gcloud container clusters create-auto my-cluster --region us-central1

# Wire kubectl to it
gcloud container clusters get-credentials my-cluster --region us-central1
kubectl get nodes
```

## Deploy a workload

```bash
kubectl create deployment web --image=us-docker.pkg.dev/PROJECT_ID/repo/web:latest
kubectl expose deployment web --type=LoadBalancer --port=80 --target-port=8080
kubectl get service web   # watch for the external IP
```

## Cloud Run vs GKE — quick guide

| Want… | Use |
| --- | --- |
| Stateless HTTP service, minimal ops, scale-to-zero | **Cloud Run** |
| Long-running/stateful, custom networking, full k8s API | **GKE** |
| k8s but minimal node ops | **GKE Autopilot** |

> Start on Cloud Run; graduate to GKE when you actually hit its limits. Running a
> cluster is real, recurring operational work.
