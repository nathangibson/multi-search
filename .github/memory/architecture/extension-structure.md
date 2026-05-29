# Extension Structure

## Problem
Defines how the Firefox WebExtension is wired together: manifest, background script, sidebar page, settings page, and utility modules.

## How it's implemented

```
manifest.json         — MV3; permissions, sidebar_action, options_ui, background scripts
background.js         — Listens for OPEN_SEARCH_TABS; opens tabs then calls browser.tabs.group()
sidebar/
  sidebar.html        — Sidebar panel (type="module" script); has ⚙ settings button
  sidebar.css
  sidebar.js          — Loads sites from storage, renders checkboxes, sends search message
settings/
  settings.html       — Full-tab options page (type="module" script)
  settings.css
  settings.js         — Site CRUD, import/export, reset
utils/
  sites.js            — DEFAULT_SITES constant (7 hardcoded sites)
  urlBuilder.js       — buildSearchUrl() with regex global replacement
storage/
  storage.js          — browser.storage.local wrapper (loadSites, saveSites, loadSelectedSites, saveSelectedSites, getDefaultSites)
icons/
  icon-16.png, icon-48.png, icon-128.png, icon.svg
```

## Key Decisions
- **Firefox MV3**: uses `background.scripts` (not `service_worker` — Chrome-only)
- **Tab grouping**: `browser.tabs.group({ tabIds })` after opening all tabs; requires `tabGroups` permission
- **Settings page**: `open_in_tab: true` — opens as a full browser tab via `browser.runtime.openOptionsPage()`
- **ES Modules**: sidebar and settings use `<script type="module">`; background is self-contained (no imports)
- **Permissions**: `storage`, `tabs`, `tabGroups` — minimal necessary set

## Constraints
- No build step — plain JS loaded directly by Firefox
- `browser` namespace throughout (not `chrome`)

