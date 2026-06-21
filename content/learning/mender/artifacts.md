---
title: Mender Artifacts
description: The .mender update package — what's inside, device-type compatibility, and full-image vs application updates.
level: Beginner
order: 2
tags: [artifacts, packaging]
aiGenerated: true
---

## What an Artifact is

A Mender **Artifact** (a `.mender` file) is the unit you deploy. It bundles the
update **payload** with **metadata** so a device can decide whether the update
applies to it and how to install it. Crucially, it records the **compatible device
types** — a device refuses an Artifact that isn't marked compatible with it, which
prevents flashing the wrong image onto the wrong hardware.

## Two update strategies

- **Full rootfs image** — the classic A/B update from the previous guide: the whole
  root filesystem is replaced on the inactive partition. Maximally robust, larger
  payloads.
- **Application / Update Modules** — update *part* of the system (a container, a
  package, a file set, a directory) without rewriting the whole rootfs. Mender's
  **Update Modules** are an extension mechanism: a small handler script defines how
  to install a given payload type (e.g. `docker`, `single-file`, `deb`).

Pick full-image when you want the strongest atomicity/rollback guarantees; pick an
application update when payloads are small and you don't want to reboot the world.

## Building an Artifact

The `mender-artifact` CLI builds and inspects Artifacts (read-only references):

```bash
# Build a full rootfs-image Artifact
mender-artifact write rootfs-image \
  --file core-image.ext4 \
  --artifact-name release-1.2.0 \
  --device-type my-device \
  --output-path release-1.2.0.mender
```

```bash
# Inspect an existing Artifact's metadata
mender-artifact read release-1.2.0.mender
```

> **`--artifact-name` and `--device-type` are not cosmetic.** The server uses the
> artifact name to know whether a device is already up to date, and the device uses
> the device type to accept or reject the update.

Next: pushing Artifacts to fleets — **Deployments**.
