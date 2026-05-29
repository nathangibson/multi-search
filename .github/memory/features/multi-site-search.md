# Multi-Site Search

## What it does
Allows users to enter a single search query in the Firefox sidebar, select from 6 predefined bibliography sites, and open all results simultaneously in a new browser window (one tab per site).

## Key Files
- `sidebar/sidebar.html` — sidebar panel markup
- `sidebar/sidebar.css` — sidebar styling
- `sidebar/sidebar.js` — UI logic: renders checkboxes, validates input, sends search message
- `background.js` — service worker: receives message, opens tabs in a new window
- `utils/sites.js` — `DEFAULT_SITES` array (6 hardcoded sites)
- `utils/urlBuilder.js` — `buildSearchUrl(template, query)` with `encodeURIComponent`

## Predefined Sites
1. WorldCat — `https://search.worldcat.org/search?q={query}`
2. Internet Archive — `https://archive.org/search.php?query={query}`
3. Google Scholar (DE) — `https://scholar.google.de/scholar?q={query}`
4. Google Books (DE) — `https://books.google.de/books?q={query}`
5. IxTheo — `https://ixtheo.de/Search/Results?lookfor={query}`
6. NLI Rambi — `https://merhav.nli.org.il/primo-explore/search?query=any,contains,{query}&vid=NLI_Rambi&lang=en_US`

## Implementation Decisions
- Search results open in a **new window** (not the current one) to visually group results together, since Firefox MV3 has no native tab groups API
- Validation: non-empty query + at least one site selected; inline error messages shown via ARIA live region
- Enter key in the search box triggers search (same as clicking the button)
- URL placeholders use regex with global flag (`/\{query\}/g`) to replace all occurrences
