# Site Persistence

## What it does
Saves and restores which sites the user has checked in the sidebar, so selections survive page reloads and browser restarts.

## Key Files
- `storage/storage.js` — `loadSelectedSites()`, `saveSelectedSites(siteIds)`, `getDefaultSites()`

## How it works
- Uses `browser.storage.local` (all data stays local, no sync)
- Stores a single key `selectedSites` → `string[]` of site IDs
- On first use (no stored value or empty array): defaults to all enabled sites
- Saves on every checkbox change event in the sidebar

## Tradeoffs
- Empty array is treated as "never saved" and falls back to all-selected default — users cannot intentionally persist zero selections (acceptable for MVP since zero selections prevent searching anyway)
