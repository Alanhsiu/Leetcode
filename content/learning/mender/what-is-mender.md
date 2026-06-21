---
title: Why OTA Updates Are Hard (and A/B Updates)
description: The failure modes of updating remote embedded devices, and how dual-rootfs updates make them atomic.
level: Beginner
order: 1
tags: [concepts, ota, rollback]
aiGenerated: true
---

## The problem

Updating software on a server is forgiving: you can SSH in, watch logs, and fix a
botched deploy by hand. A field-deployed embedded device — a gateway on a cell
tower, an ECU in a vehicle, a sensor in a basement — gives you none of that. An
update that fails to boot can turn an expensive device into a brick that needs a
truck roll or an RMA to recover.

So an OTA system for embedded has to assume the worst: **power can be cut
mid-write**, **the new image can be corrupt**, and **the new software can crash on
boot**. The update must be **atomic** (never half-applied) and **recoverable**
(always a way back to something that boots).

## A/B (dual-rootfs) updates

Mender's core mechanism is an **A/B partition scheme**. The device has two root
filesystem partitions:

- One is **active** (currently running).
- The other is **inactive** (a spare).

An update proceeds roughly like this:

1. Download the new image and write it to the **inactive** partition. The running
   system is untouched, so a power loss here just means re-downloading later.
2. Tell the bootloader to boot the updated partition **once** (a tentative switch).
3. Reboot. If the new system boots and **commits** (passes its health checks),
   the switch becomes permanent.
4. If it fails to boot or never commits, the bootloader **rolls back** to the
   previous partition automatically.

The trade-off is storage: you need room for two root filesystems. In return you get
updates that are atomic and self-healing — the property that makes unattended fleet
updates viable.

> **Commit is the critical step.** Until the new image commits, the switch is
> provisional. This is what lets a device that boots into a broken image recover on
> the next power cycle instead of staying broken.

The next guides look at how an update is *packaged* (Mender **Artifacts**) and how
it is *delivered* to groups of devices (**Deployments**).
