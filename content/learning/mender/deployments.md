---
title: Deployments & Device Groups
description: Rolling an Artifact out to a fleet — grouping, phased rollouts, monitoring, and rollback in practice.
level: Intermediate
order: 3
tags: [deployments, fleet, rollout]
aiGenerated: true
---

## From one device to a fleet

An Artifact is *what* to install; a **Deployment** is the act of rolling it out to a
set of devices. The Mender server tracks, for every device, its current software and
the deployment's per-device status (pending → downloading → installing → rebooting →
success/failure), giving you a live view of the rollout.

## Device grouping

You target deployments at **groups** rather than individual devices. Groups can be:

- **Static** — an explicit list of devices.
- **Dynamic** — defined by a filter over device **inventory attributes** (e.g.
  `device_type = gateway AND region = eu`). New devices that match join automatically.

This is what makes fleet management scale: deploy "release-1.2.0 to the `eu-gateways`
group" instead of naming thousands of devices.

## Phased / staged rollouts

A safe rollout doesn't hit the whole fleet at once. Mender supports **phased
rollouts**: deliver to a small percentage first, watch the success rate, then expand.
Combined with the device-side **A/B rollback**, a bad release is contained — early
devices that fail to commit roll themselves back, and you halt the rollout before it
reaches the rest.

```text
Phase 1:  5%  ──▶ observe (success? errors?)
Phase 2: 25%  ──▶ observe
Phase 3: 100% ──▶ complete
            │
   any phase failing → pause/abort; A/B rollback protects the failed devices
```

## Two layers of safety

1. **Per device:** A/B partitions + commit → a device never bricks itself.
2. **Per fleet:** phased rollout + monitoring → a bad Artifact never reaches everyone.

Next: hooking into the update lifecycle and shrinking payloads — **State Scripts &
Delta Updates**.
