# Testing

## What it covers
Unit tests for the two fully testable pure/storage modules. DOM-heavy `settings.js` is not tested (would require JSDOM + extensive DOM mocking).

## Test files
- `tests/urlBuilder.test.js` — 10 tests for `buildSearchUrl()`
- `tests/storage.test.js` — 22 tests for `loadSites`, `saveSites`, `loadSelectedSites`, `saveSelectedSites`, `loadSelectedMode`, `saveSelectedMode`, `getDefaultSites` (all mode-aware)
- `tests/setup.js` — global `browser.storage.local` stub (plain functions, overridden per-test)

## Running tests
```
npm test
```
Output: `23 passed, 23 total`

## Key decisions
- **No third-party mock package** — `browser` is stubbed as `global.browser` in `tests/setup.js`; each test reassigns `.get`/`.set` as needed
- **ESM support** — `"type": "module"` in package.json + `NODE_OPTIONS=--experimental-vm-modules jest`
- **Regression tests included**:
  - `buildSearchUrl` global-replace (multiple `{query}` occurrences in one template)
  - `loadSites` empty-array bug: `[]` is now respected, not treated as "no data"

## What is NOT tested
- `settings.js` — DOM-entangled; would need JSDOM + event simulation
- `sidebar.js` / `background.js` — browser event lifecycle, hard to unit test without integration harness
- `sites.js` — constant data only, tested indirectly via storage tests
