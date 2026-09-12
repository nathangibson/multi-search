# Multi-Search

A Firefox extension that adds a persistent sidebar panel for searching across multiple sites simultaneously, organised into switchable modes.

---

## Overview

Multi-Search provides a dedicated sidebar panel with five independent search modes — **Art & Objects**, **Bibliography**, **Images**, **Manuscripts**, and **Shopping** — each with its own set of sites, groups, and remembered state. You can:

- Switch between modes using a dropdown (state is saved per mode)
- Enter a query once; the last query per mode is pre-filled on next open
- Select which sites to search via checkboxes, individually or by group (saved per mode)
- Click **Search** to open all selected sites in a Firefox tab group

---

## Installation

### Development (temporary)

Load as a temporary add-on:

1. Open `about:debugging` in Firefox
2. Click **This Firefox**
3. Click **Load Temporary Add-on…**
4. Select `manifest.json` from this folder

> No build step required. Reload at `about:debugging` after code changes.

### Persistent Install

Install from the pre-built `.xpi` (persists across browser restarts):

1. Download the latest `.xpi` from the [Releases](https://github.com/nathangibson/multi-search/releases) page
2. Open Firefox → **Add-ons** (`about:addons`)
3. Click the gear ⚙ → **"Install Add-on From File…"**
4. Select the `.xpi` file

### Build from source

```bash
zip -r multi-search-plugin-1.0.0.xpi manifest.json background.js sidebar/ settings/ sites/ storage/ utils/ icons/ \
  -x "node_modules/*" "tests/*" "package*.json" "*.md" ".git/*" "scripts/*" "updates.json" "dist/*"
```

---

## Usage

### Searching

1. Open the sidebar (click the extension icon in the toolbar)
2. Select a mode from the dropdown (Art & Objects, Bibliography, Images, Manuscripts, Shopping)
3. Type a search query — the field is pre-filled with your last query for this mode
4. Check/uncheck sites as needed — group headers check all member sites at once (selections are remembered per mode)
5. Press **Enter** or click **Search**
6. All selected sites open in a new Firefox tab group; the first tab is focused

### Settings

Click **⚙** in the sidebar (or open via Firefox's Add-ons manager) to manage sites:

| Action | How |
|--------|-----|
| Add a site | Click **Add Site**, fill in name + URL template, click Save |
| Edit a site | Click **Edit** on any row |
| Delete a site | Click **Delete** on any row |
| Reorder | Use **↑** / **↓** buttons |
| Enable/disable | Toggle the checkbox in the Enabled column |
| Test a template | Click **▶ Test** while editing to open a preview tab |
| Export | **Export JSON** — downloads current mode's sites and groups |
| Export all | **Export All Modes** — downloads every mode as a separate file, named from the mode name (e.g. "Art & Objects" → `art-objects.json`) |
| Import | **Import JSON** — upserts sites by ID; a file with a new `modeId` can create a new mode |
| Reset | **Reset to Defaults** — restores the current mode's predefined sites |

All settings are scoped to the **currently selected mode**.

### Managing modes

| Action | How |
|--------|-----|
| Add a mode | Click **+ Add Mode** |
| Rename a mode | Click **Rename** |
| Export every mode | Click **Export All Modes** |
| Delete a mode | Click **Delete Mode** (cannot delete the last one) |

---

## Modes & Default Sites

The built-in defaults are generated from the JSON files in `sites/`. After editing those files, re-sync with:

```bash
python3 scripts/sync-sites.py
```

| Mode | Predefined sites |
|------|-----------------|
| **Art & Objects** | Europeana, British Museum, Wikimedia Commons, Metropolitan Museum, Israel Museum |
| **Bibliography** | WorldCat, Internet Archive, Google Scholar (DE), Google Books (DE), IxTheo, NLI Rambi |
| **Images** | Google Images CC, Unsplash, Pixabay, Wikimedia Commons, Flickr CC, DuckDuckGo CC, Openverse, Open Clip Art, Clker |
| **Manuscripts** | Qalamos, Fihrist, Cambridge University Digital Library, Sinai, Vatican, Gallica BnF, Kairawan |
| **Shopping** | Google Shopping, Amazon.de |

Bibliography, Images, and Manuscripts modes also ship with predefined **groups** for one-click multi-site selection. `bibliography-ubffm.json` is kept as an alternative Bibliography configuration (importable via **Import JSON**) but is not loaded by default.

---

## URL Templates

Search URL templates use `{query}` as a placeholder for the URL-encoded search term:

```
https://example.com/search?q={query}
```

Use `{query_raw}` if the site needs the unencoded query (spaces preserved):

```
https://example.com/search?q={query_raw}
```

---

## Updating

The add-on checks `updates.json` (served via GitHub Pages at `nathangibson.github.io/multi-search/updates.json`) for new versions. To ship an update:

1. Bump `version` in `manifest.json`
2. Rebuild the `.xpi`
3. Create a GitHub release with the new `.xpi`
4. Add a new entry to `updates.json` with the new version and its release download URL
5. Commit and push — GitHub Pages serves the updated manifest

---

## Development

```bash
npm test       # run unit tests (Jest)
```

> Node.js note: use the Homebrew node (`/opt/homebrew/bin/node`); the `/usr/local` install is broken on this machine.

All data is stored locally via `browser.storage.local`. No external servers, no tracking.
