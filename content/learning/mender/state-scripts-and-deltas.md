---
title: State Scripts & Delta Updates
description: Hooking custom logic into the update lifecycle, and shipping only what changed.
level: Advanced
order: 4
tags: [state-scripts, delta, lifecycle]
aiGenerated: true
---

## State scripts — hook into the update lifecycle

An update moves through well-defined **states**. **State scripts** let you run your
own logic at the transitions — to quiesce the application, take a backup, or run a
health check that decides whether to commit or roll back.

Typical states (each has `Enter`/`Leave`/`Error` hooks):

```text
Idle → Sync → Download → ArtifactInstall → ArtifactReboot
     → ArtifactCommit            (success path)
     → ArtifactRollback          (failure path)
```

Common uses:

- **Download_Enter** — stop nonessential services to free resources.
- **ArtifactInstall_Leave** — migrate data formats for the new version.
- **ArtifactCommit_Enter** — run an application-level health check; failing here
  triggers rollback *before* the switch is made permanent.

State scripts can run from the **rootfs** (the running system) or from the
**Artifact** itself (so an update can carry the exact scripts it needs).

## Delta updates — ship only the diff

Full rootfs images are robust but large; pushing a whole image for a one-line change
wastes bandwidth (costly over cellular, slow for big fleets). **Delta updates**
compute a **binary diff** between the device's current image and the target image and
transmit only the changed blocks; the device reconstructs the full target locally.

The trade-off: deltas are generated **per source→target pair**, so a fleet on many
different starting versions needs many deltas (or a fallback to full images). The
robustness story is unchanged — the reconstructed image still installs via the same
atomic A/B + commit flow.

> **Rule of thumb:** start with full-image A/B updates (simplest, safest). Add state
> scripts when you need app-aware health checks/migrations, and delta updates when
> bandwidth or update size becomes the bottleneck.

That completes the Mender outline.
