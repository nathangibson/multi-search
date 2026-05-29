# Modes

## What it does
Adds a dropdown at the top of the sidebar and settings page to switch between independent search contexts: **Bibliography**, **Images**, **Manuscripts**, **Shopping**. Each mode has its own site list and selected-sites state.

## Key files
- `utils/sites.js` — `MODES` array + `DEFAULT_SITES_BY_MODE` object
- `storage/storage.js` — all storage functions now take `modeId` param; stores `sitesByMode` and `selectedSitesByMode` objects
- `sidebar/sidebar.html` — `<select id="mode-select">` above search input
- `sidebar/sidebar.js` — populates dropdown from `MODES`, switches mode on change
- `sidebar/sidebar.css` — `.mode-section` and `#mode-select` styling
- `settings/settings.html` — `.mode-picker` section above sites table
- `settings/settings.css` — `.mode-picker` block styling
- `settings/settings.js` — `currentMode` state; all CRUD/import/export/reset scoped to selected mode

## Mode definitions
```js
{ id: 'bibliography', name: 'Bibliography' }  // 7 default sites
{ id: 'images',       name: 'Images' }         // empty skeleton
{ id: 'manuscripts',  name: 'Manuscripts' }    // empty skeleton
{ id: 'shopping',     name: 'Shopping' }       // empty skeleton
```

## Storage layout (post-modes)
| Key | Type | Purpose |
|-----|------|---------|
| `sitesByMode` | `{ [modeId]: Site[] }` | Per-mode site arrays |
| `selectedMode` | `string` | Last active mode (default: `'bibliography'`) |
| `selectedSitesByMode` | `{ [modeId]: string[] }` | Per-mode checked site IDs |

## Migration (backward compat)
- Old flat `sites` key → treated as `bibliography` sites if `sitesByMode` absent
- Old flat `selectedSites` key → treated as bibliography selections if `selectedSitesByMode` absent
- No write-back migration needed; old keys are just read as fallback

## Settings behaviour
- Mode selector synced with sidebar (both call `saveSelectedMode`)
- Reset to defaults resets only the current mode's sites
- Import/export applies to current mode only
