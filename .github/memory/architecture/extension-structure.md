# Extension Structure

## Problem
Defines how the Firefox WebExtension is wired together: manifest, background service worker, sidebar page, and utility modules.

## How it's implemented

```
manifest.json         — Manifest V3; declares permissions, sidebar_action, background SW
background.js         — Service worker; listens for OPEN_SEARCH_TABS message, opens tabs
sidebar/
  sidebar.html        — Sidebar page (type="module" script)
  sidebar.css
  sidebar.js          — ES module; imports from utils/ and storage/
utils/
  sites.js            — DEFAULT_SITES constant (ES module export)
  urlBuilder.js       — buildSearchUrl() utility (ES module export)
storage/
  storage.js          — browser.storage.local wrapper (ES module export)
icons/
  icon-16.png, icon-48.png, icon-128.png, icon.svg
```

## Key Decisions
- **Manifest V3 (Firefox)**: uses `background.scripts` — Firefox MV3 does not support `service_worker` (unlike Chrome); background script runs as a persistent event page
- **ES Modules**: sidebar uses `<script type="module">` enabling clean imports across files; background does not use imports (self-contained)
- **Permissions**: `storage`, `tabs`, `windows` — minimal necessary set
- **Gecko ID**: `multi-search-bibliography@extension` with `strict_min_version: 109.0`

## Constraints
- No build step — plain JS files loaded directly by the browser
- `browser` namespace (Firefox) used throughout; not `chrome`
