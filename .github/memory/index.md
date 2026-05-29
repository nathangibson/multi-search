# Memory Index

## Purpose
Firefox extension (Manifest V3) that enables simultaneous searching across multiple websites from a sidebar, organised into switchable modes (Bibliography, Images, Manuscripts, Shopping).

## Stack
- Vanilla JavaScript (ES Modules, no build step)
- Firefox WebExtensions API (Manifest V3)
- `browser.storage.local` for persistence
- `browser.tabs` + `browser.tabs.group()` for tab management
- Jest (ESM, `--experimental-vm-modules`) for unit tests

## Features
- [multi-site-search](./features/multi-site-search.md) — sidebar UI + search execution
- [modes](./features/modes.md) — switchable mode dropdown (Bibliography, Images, Manuscripts, Shopping)
- [site-persistence](./features/site-persistence.md) — per-mode site lists and selections persisted
- [site-management](./features/site-management.md) — settings page: per-mode add/edit/delete/reorder/import/export
- [last-query](./features/last-query.md) — last query per mode pre-filled in search box, persisted in storage
- [skills](./features/skills.md)

## Architecture
- [extension-structure](./architecture/extension-structure.md) — manifest, background script, sidebar, settings
- [testing](./architecture/testing.md) — Jest ESM unit tests, manual browser mock, 40 tests

## Recent Changes
- 2026-05-29: README.md written; last-query tests added (40 tests passing); last-query feature complete
- 2026-05-29: Modes feature — 4 switchable modes, per-mode storage, sidebar dropdown, settings mode picker
- 2026-05-29: Added Jest unit tests — 32 tests across urlBuilder and storage (all passing)
- 2026-05-29: Phase 2 implemented — settings page with full site CRUD, import/export, reset
- 2026-05-29: Switched from new-window grouping to `browser.tabs.group()` native tab groups
