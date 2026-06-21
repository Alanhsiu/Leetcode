---
title: Mender
description: Over-the-air (OTA) software updates for embedded Linux and IoT device fleets.
order: 0
aiGenerated: true
tags: [overview]
---

**Mender** is an open-source system for delivering **over-the-air (OTA) updates**
to fleets of embedded Linux devices. Its headline feature is **robust, atomic
updates with automatic rollback**: an update is written to an inactive partition,
the bootloader switches to it, and if the new image fails to boot or fails its
health check, the device rolls back to the known-good partition — so a bad update
doesn't brick a remote device.

This track is a concept-first tour. It is **AI-drafted** and not yet verified —
confirm specifics against the [official Mender docs](https://docs.mender.io/).

### What you'll learn
- Why OTA for embedded is hard, and how A/B (dual-rootfs) updates make it safe.
- Mender **Artifacts** and the difference between full-image and application updates.
- **Deployments** to device groups, plus state scripts and delta updates.
