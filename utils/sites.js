// Default site configurations for Phase 1 MVP
// These sites are hardcoded and cannot be modified by the user in Phase 1

export const DEFAULT_SITES = [
  {
    id: "worldcat",
    name: "WorldCat",
    baseUrl: "https://search.worldcat.org/",
    searchTemplate: "https://search.worldcat.org/search?q={query}",
    enabled: true,
    order: 0
  },
  {
    id: "archive-org",
    name: "Internet Archive",
    baseUrl: "https://archive.org/",
    searchTemplate: "https://archive.org/search.php?query={query}",
    enabled: true,
    order: 1
  },
  {
    id: "google-scholar-de",
    name: "Google Scholar (DE)",
    baseUrl: "https://scholar.google.de/",
    searchTemplate: "https://scholar.google.de/scholar?q={query}",
    enabled: true,
    order: 2
  },
  {
    id: "google-books-de",
    name: "Google Books (DE)",
    baseUrl: "https://books.google.de/",
    searchTemplate: "https://books.google.de/books?q={query}",
    enabled: true,
    order: 3
  },
  {
    id: "ixtheo",
    name: "IxTheo",
    baseUrl: "https://ixtheo.de/",
    searchTemplate: "https://ixtheo.de/Search/Results?lookfor={query}",
    enabled: true,
    order: 4
  },
  {
    id: "nli-rambi",
    name: "NLI Rambi",
    baseUrl: "https://merhav.nli.org.il/primo-explore/search",
    searchTemplate: "https://merhav.nli.org.il/primo-explore/search?query=any,contains,{query}&vid=NLI_Rambi&lang=en_US",
    enabled: true,
    order: 5
  },
  {
    id: "hebis-frankfurt",
    name: "HeBIS Frankfurt (UB)",
    baseUrl: "https://ubffm.hds.hebis.de/",
    searchTemplate: "https://ubffm.hds.hebis.de/Search/Results?lookfor={query}&type=AllFields",
    enabled: true,
    order: 6
  }
];
