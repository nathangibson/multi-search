# Last Query (per mode)

## What it does
Pre-fills the search input with the most recent query for the active mode. Each mode remembers its own last query independently.

## Key files
- `storage/storage.js` — `loadLastQuery(modeId)`, `saveLastQuery(modeId, query)`
- `sidebar/sidebar.js` — calls `loadLastQuery` in `loadModeData()` to pre-fill input; calls `saveLastQuery` in `handleSearch()` before opening tabs
- `tests/storage.test.js` — 8 tests covering load/save, mode isolation, error resilience

## Storage schema
```json
{ "lastQueryByMode": { "bibliography": "last query text", "images": "" } }
```

## Decisions
- Only the most recent query per mode is stored (no history)
- Returns `''` on error or absent key — never throws
- Saved on search execution (not on every keystroke)
