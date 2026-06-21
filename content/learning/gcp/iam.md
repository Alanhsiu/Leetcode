---
title: IAM — Who Can Do What
description: Principals, roles, and bindings on the resource hierarchy — plus service accounts and least privilege.
level: Intermediate
order: 5
tags: [security, iam, access-control]
aiGenerated: true
---

## The core sentence

GCP IAM answers one question: **who (principal) can do what (role) on which
resource?** An **IAM policy** is a set of **bindings**, each tying a role to one or
more principals, attached to a resource.

- **Principal (member):** a user, group, **service account**, or domain.
- **Role:** a bundle of permissions. Three kinds:
  - **Basic** — `roles/owner`, `roles/editor`, `roles/viewer` (broad; avoid in prod).
  - **Predefined** — service-scoped, e.g. `roles/run.admin`, `roles/storage.objectViewer`.
  - **Custom** — your own hand-picked permission set.
- **Binding:** `role → [principals]` on a resource.

## Inheritance down the hierarchy

Policies attach at **Organization → Folder → Project → Resource**, and **inherit
downward**. A role granted at the project level applies to resources within it. This
makes broad grants dangerous — prefer granting at the narrowest scope that works.

```text
Organization
└── Folder
    └── Project            ← grant here = applies to everything in the project
        └── Bucket/Service ← grant here = scoped to just this resource
```

## Service accounts

A **service account** is a non-human principal that *workloads* run as (a Cloud Run
service, a GKE pod, a VM). Grant it only the roles its job needs. Prefer attaching a
service account to the workload over distributing **key files**, which are long-lived
secrets that leak.

## Commands (read-only)

```bash
# Grant a predefined role at project scope
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:app@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.objectViewer"

# Inspect who has what
gcloud projects get-iam-policy PROJECT_ID
```

> **Least privilege:** predefined/custom roles over basic; narrowest scope that
> works; workload identity over key files. Audit bindings regularly.
