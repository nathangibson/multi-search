# Site Persistence

## What it does
Saves and restores which sites the user has checked in the sidebar, and stores custom site configurations per mode added via the settings page.

## Key Files
- `storage/storage.js` — all functions take `modeId` as first argument

## Storage keys
| Key | Value | Purpose |
|-----|-------|---------|
| `sitesByMode` | `{ [modeId]: Site[] }` | Per-mode custom site lists |
| `selectedMode` | `string` | Active mode ID |
| `selectedSitesByMode` | `{ [modeId]: string[] }` | Per-mode checked site IDs |
| `sites` *(legacy)* | `Site[]` | Migrated → bibliography on first load |
| `selectedSites` *(legacy)* | `string[]` | Migrated → bibliography on first load |

## How it works
- `loadSites(modeId)`: returns stored array for mode; if key absent, returns `DEFAULT_SITES_BY_MODE[modeId]`; `[]` is respected
- `loadSelectedSites(modeId)`: if absent/empty, defaults to all enabled sites for that mode
- `saveSites`/`saveSelectedSites`: read-modify-write on the outer object (only writes changed mode)
- `getDefaultSites(modeId)`: returns the default array for that mode


