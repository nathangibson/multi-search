# Site Management (Phase 2)

## What it does
Provides a full settings page for managing bibliography search sites: add, edit, delete, reorder (up/down), enable/disable, import from JSON, export to JSON, and reset to defaults.

## Key Files
- `settings/settings.html` — settings page markup (table + add/edit form)
- `settings/settings.css` — settings page styling
- `settings/settings.js` — all site management logic (ES module)
- `storage/storage.js` — `loadSites()`, `saveSites()` (extended from Phase 1)
- `manifest.json` — `options_ui` entry pointing to `settings/settings.html`

## How it works
- Sites are stored in `browser.storage.local` under key `"sites"` as a JSON array
- First load (key absent / null): falls back to DEFAULT_SITES from `utils/sites.js`
- Empty array `[]` is preserved as-is (user intentionally cleared all sites)
- Settings page is opened via `browser.runtime.openOptionsPage()` from the sidebar ⚙ button
- `open_in_tab: true` in manifest so settings open as a full tab

## Form behaviour
- Add: slug ID generated from name (`lower-kebab-case`), made unique with timestamp suffix if collision
- Edit: form pre-filled; only `name`, `searchTemplate`, `baseUrl`, `enabled` updated; `order` preserved
- Validation: name non-empty + template must contain `{query}` placeholder
- Test button: opens `buildSearchUrl(template, 'test query')` in a new tab

## Import / Export
- Export: `sites.json` Blob download of current array
- Import: JSON file → validate array entries (id, name, searchTemplate with `{query}`) → upsert by id
  - Existing sites: name/template/baseUrl/enabled updated; `order` **preserved** (not overwritten)
  - New sites: appended with next available order index
- Reset: confirm dialog → replaces sites with `getDefaultSites()` clone

## Reordering
- Up/Down buttons swap adjacent array entries; `order` values normalized to array index on each render
- Buttons disabled at list boundaries

## Mode awareness
- All CRUD, import, export, and reset operate on `currentMode` only
- Mode selector at top of settings page; change reloads sites and hides open form
- `currentMode` synced to storage via `saveSelectedMode` on change
