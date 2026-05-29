# Memory Index

## Purpose
Firefox extension (Manifest V3) that enables simultaneous searching across multiple bibliography/library websites from a single sidebar interface.

## Stack
- Vanilla JavaScript (ES Modules, no build step)
- Firefox WebExtensions API (Manifest V3)
- `browser.storage.local` for persistence
- `browser.tabs` + `browser.tabs.group()` for tab management

## Features
- [multi-site-search](./features/multi-site-search.md) — sidebar UI + search execution
- [site-persistence](./features/site-persistence.md) — remembers selected sites and custom site list
- [site-management](./features/site-management.md) — settings page: add/edit/delete/reorder/import/export
- [skills](./features/skills.md)

## Architecture
- [extension-structure](./architecture/extension-structure.md) — manifest, background script, sidebar, settings

## Recent Changes
- 2026-05-29: Phase 2 implemented — settings page with full site CRUD, import/export, reset
- 2026-05-29: Switched from new-window grouping to `browser.tabs.group()` native tab groups
- 2026-05-28: Phase 1 MVP implemented — sidebar, background script, storage, 7 predefined sites
