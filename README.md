# Multi-Site Search

A Firefox extension that adds a persistent sidebar panel for searching across multiple sites simultaneously, organised into switchable modes.

---

## Overview

Multi-Site Search provides a dedicated sidebar panel with four independent search modes — **Bibliography**, **Images**, **Manuscripts**, and **Shopping** — each with its own set of sites and remembered state. You can:

- Switch between modes using a dropdown (state is saved per mode)
- Enter a query once; the last query per mode is pre-filled on next open
- Select which sites to search via checkboxes (saved per mode)
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

1. Download the latest `.xpi` from the [Releases](https://github.com/youruser/multi-search-plugin/releases) page
2. Open Firefox → **Add-ons** (`about:addons`)
3. Click the gear ⚙ → **"Install Add-on From File…"**
4. Select the `.xpi` file

### Build from source

```bash
# Requires Node.js (system node at /opt/homebrew/bin/node; /usr/local/bin/node is broken)
zip -r multi-search-plugin-1.0.0.xpi manifest.json background.js sidebar/ settings/ sites/ storage/ utils/ icons/ \
  -x "node_modules/*" "tests/*" "package*.json" "*.md" ".git/*"
```

---

## Usage

### Searching

1. Open the sidebar (click the extension icon in the toolbar)
2. Select a mode from the dropdown (Bibliography, Images, Manuscripts, Shopping)
3. Type a search query — the field is pre-filled with your last query for this mode
4. Check/uncheck sites as needed (selections are remembered per mode)
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
| Export | **Export JSON** — downloads current mode's sites as `bibliography-sites.json` |
| Import | **Import JSON** — upserts sites by ID; existing order is preserved |
| Reset | **Reset to Defaults** — restores the current mode's predefined sites |

All settings are scoped to the **currently selected mode**.

---

## Modes & Default Sites

| Mode | Predefined sites |
|------|-----------------|
| **Bibliography** | WorldCat, Internet Archive, Google Scholar (DE), Google Books (DE), IxTheo, NLI Rambi, HeBIS Frankfurt |
| **Images** | *(empty — add your own)* |
| **Manuscripts** | *(empty — add your own)* |
| **Shopping** | *(empty — add your own)* |

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

## Development

```bash
npm test       # run unit tests (Jest, 32 tests)
```

All data is stored locally via `browser.storage.local`. No external servers, no tracking.

