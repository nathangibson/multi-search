# Memory Index

## Purpose
Firefox extension (Manifest V3) that enables simultaneous searching across multiple bibliography/library websites from a single sidebar interface.

## Stack
- Vanilla JavaScript (ES Modules, no build step)
- Firefox WebExtensions API (Manifest V3)
- `browser.storage.local` for persistence
- `browser.windows` / `browser.tabs` for tab management

## Features
- [multi-site-search](./features/multi-site-search.md) — sidebar UI + search execution
- [site-persistence](./features/site-persistence.md) — remembers selected sites
- [skills](./features/skills.md)

## Architecture
- [extension-structure](./architecture/extension-structure.md) — manifest, background SW, sidebar

## Recent Changes
- 2026-05-28: Phase 1 MVP implemented — sidebar, background service worker, storage, 6 predefined sites
