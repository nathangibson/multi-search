# Site Persistence

## What it does
Saves and restores which sites the user has checked in the sidebar, and stores custom site configurations added via the settings page.

## Key Files
- `storage/storage.js` — `loadSites()`, `saveSites()`, `loadSelectedSites()`, `saveSelectedSites()`, `getDefaultSites()`

## Storage keys
| Key | Value | Purpose |
|-----|-------|---------|
| `sites` | `Site[]` or absent | User's custom site list |
| `selectedSites` | `string[]` | IDs of checked sites in sidebar |

## How it works
- `loadSites()`: returns stored array; if key is **null/absent**, returns DEFAULT_SITES; empty `[]` is respected (user cleared all)
- `loadSelectedSites()`: if absent or empty, defaults to all enabled site IDs from DEFAULT_SITES
- Both save functions fail silently (console.error) — storage errors don't crash the UI
- `getDefaultSites()` returns the DEFAULT_SITES constant for use by the settings reset feature

