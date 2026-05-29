# Multi-Site Bibliography Search - Firefox Extension Specification

## Overview
A Firefox extension that enables simultaneous searching across multiple bibliography/library websites from a single interface. Users enter a search query once, select which sites to search via checkboxes, and the extension opens all selected searches in a tab group.

## User Story
As a researcher, I want to search for bibliography items across multiple sites without manually visiting each site and entering the same query repeatedly, so I can save time and improve my research workflow.

## Core Features

### 1. Search Interface (Sidebar Panel)
- **Location**: Persistent sidebar panel in Firefox
- **Components**:
  - Text input field for search query
  - List of checkboxes for available bibliography sites
  - "Search" button to execute the multi-site search
  - Settings/configuration button to manage sites

### 2. Site Management
- **Predefined Sites** (initial configuration):
  - WorldCat: `https://search.worldcat.org/`
  - Internet Archive: `https://archive.org/`
  - Google Scholar (DE): `https://scholar.google.de/`
  - Google Books (DE): `https://books.google.de/`
  - IxTheo: `https://ixtheo.de/`
  - NLI Rambi: `https://merhav.nli.org.il/primo-explore/search?vid=NLI_Rambi&lang=en_US`

- **Site Configuration** (per site):
  - Display name (shown in UI)
  - Base URL
  - Search URL template with placeholder for query (e.g., `https://example.com/search?q={query}`)
  - Enabled/disabled state
  - Sort order for display

- **Management Features**:
  - Add new sites
  - Edit existing site configurations
  - Remove sites
  - Reorder sites (drag-and-drop or up/down buttons)
  - Import/export site configurations (JSON format)

### 3. State Persistence
- **Remember User Preferences**:
  - Last selected (checked) sites per mode
  - Last search query per mode (pre-filled in search box on next open)
  - Site configurations per mode

- **Storage**: Use Firefox's `browser.storage.local` API

### 4. Search Execution
- **Behavior**:
  - When user clicks "Search", create a new tab group
  - Open each selected site's search URL in a separate tab within the group
  - URL-encode the search query appropriately
  - Group tabs together using Firefox Container Tabs or tab grouping API
  - Focus on the first opened tab

- **Query Handling**:
  - Trim whitespace from query
  - URL-encode special characters
  - Support for advanced queries (if user enters complex search operators, pass them through)

### 5. Settings/Options Page
- **Accessible from**: 
  - Settings button in sidebar
  - Firefox add-ons manager
  
- **Configuration Options**:
  - Site management interface (add/edit/remove)
  - Export/import settings

## Technical Architecture

### Extension Structure

```
multi-site-bibliography-search/
├── manifest.json                 # Extension manifest (Manifest V2/V3)
├── icons/
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
├── sidebar/
│   ├── sidebar.html              # Main search interface
│   ├── sidebar.css               # Styling
│   └── sidebar.js                # Search logic and UI interactions
├── settings/
│   ├── settings.html             # Options/settings page
│   ├── settings.css
│   └── settings.js               # Site management UI
├── background.js                 # Background script (tab management, API calls)
├── storage/
│   └── storage.js                # Storage abstraction layer
└── utils/
    ├── sites.js                  # Default site configurations
    └── urlBuilder.js             # URL construction utilities
```

### Key Components

#### 1. Manifest Configuration
- **Permissions Required**:
  - `storage` - for saving preferences and site configurations
  - `tabs` - for opening and managing tabs
  - `tabGroups` or `contextualIdentities` - for tab grouping
  - `sidebarAction` - for sidebar panel

#### 2. Sidebar Panel (`sidebar/`)
- **HTML**: 
  - Search input field
  - Dynamically generated checkbox list from stored sites
  - Search button
  - Settings icon/button
  
- **JavaScript**:
  - Load saved site configurations on startup
  - Restore last checked sites
  - Handle search button click
  - Send message to background script to open tabs
  - Validation (non-empty query, at least one site selected)

#### 3. Background Script (`background.js`)
- **Responsibilities**:
  - Listen for messages from sidebar
  - Create tab group
  - Open multiple tabs with constructed URLs
  - Handle tab grouping/organization
  - Coordinate between sidebar and browser APIs

#### 4. Storage Layer (`storage/storage.js`)
- **Data Structure**:
```javascript
{
  sites: [
    {
      id: "worldcat",
      name: "WorldCat",
      baseUrl: "https://search.worldcat.org/",
      searchTemplate: "https://search.worldcat.org/search?q={query}",
      enabled: true,
      order: 0
    },
    // ... more sites
  ],
  preferences: {
    selectedSites: ["worldcat", "google-scholar", "archive-org"],
    rememberQuery: false,
    lastQuery: ""
  }
}
```

- **API Functions**:
  - `loadSites()` - Get all configured sites
  - `saveSites(sites)` - Save site configurations
  - `loadPreferences()` - Get user preferences
  - `savePreferences(prefs)` - Save preferences
  - `getDefaultSites()` - Return initial site configurations

#### 5. Settings Page (`settings/`)
- **Features**:
  - Table/list of configured sites
  - Add site form (name, search template)
  - Edit/delete buttons per site
  - Drag-and-drop reordering
  - Import/export buttons (JSON)
  - Preview button to test search URL construction

- **Validation**:
  - Ensure search template contains `{query}` placeholder
  - Validate URL format
  - Prevent duplicate site IDs

### URL Template System
- **Template Format**: `https://example.com/search?q={query}`
- **Placeholders**:
  - `{query}` - URL-encoded search query
  - `{query_raw}` - Raw query (not encoded, for special cases)
  
- **URL Builder** (`utils/urlBuilder.js`):
```javascript
function buildSearchUrl(template, query) {
  const encodedQuery = encodeURIComponent(query.trim());
  return template
    .replace('{query}', encodedQuery)
    .replace('{query_raw}', query.trim());
}
```

### Default Site Configurations (`utils/sites.js`)
```javascript
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
  }
];
```

## User Workflows

### Primary Workflow: Multi-Site Search
1. User opens Firefox sidebar (click extension icon or use keyboard shortcut)
2. Extension loads with previously selected sites checked
3. User enters bibliography search query in text field
4. User reviews checked sites, adjusts selections if needed
5. User clicks "Search" button
6. Extension creates a new tab group and opens all selected sites in separate tabs
7. User reviews results across all tabs

### Configuration Workflow: Add New Site
1. User opens settings page from sidebar
2. User clicks "Add Site" button
3. Form appears with fields: Name, Search URL Template
4. User enters site details (e.g., Name: "JSTOR", Template: "https://www.jstor.org/action/doBasicSearch?Query={query}")
5. User clicks "Save"
6. New site appears in sidebar checkbox list
7. User can now include this site in searches

### Configuration Workflow: Edit Search Template
1. User opens settings page
2. User finds site in list, clicks "Edit" button
3. Form populates with current values
4. User modifies search template
5. User clicks "Test" to preview with sample query
6. User confirms and saves changes

## Error Handling

### Input Validation
- **Empty Query**: Show inline error "Please enter a search query"
- **No Sites Selected**: Show inline error "Please select at least one site"
- **Invalid URL Template**: Show error in settings "Search template must contain {query} placeholder"

### Runtime Errors
- **Storage Unavailable**: Fall back to default sites, show warning
- **Tab Creation Failed**: Show error notification, log details to console
- **Invalid Site Configuration**: Skip site, log warning, notify user

## Future Enhancements (Not in Initial Scope)
- Keyboard shortcuts for common actions
- Search history with quick re-run
- Saved search presets (query + site combinations)
- Result preview/scraping within extension
- Browser action toolbar button (in addition to sidebar)
- Dark mode theme
- Localization/internationalization
- Context menu integration (right-click selected text → "Search with Multi-Site")
- Statistics (most-used sites, search frequency)

## Success Metrics
- Time saved per search session (vs. manual site-by-site searching)
- Number of active users
- Most-used sites (to inform default selections)
- User retention rate

## Development Phases

### Phase 1: MVP (Minimum Viable Product)
- Basic sidebar with search interface
- Predefined 6 sites (hardcoded)
- Open tabs in tab group
- Remember selected sites

### Phase 2: Configuration
- Settings page for site management
- Add/edit/remove sites
- Import/export functionality

### Phase 3: Polish
- Improved UI/UX
- Error handling refinements
- Performance optimizations
- User documentation

### Phase 4: Future Features
- Implement features from "Future Enhancements" based on user feedback

## Technical Considerations

### Cross-Browser Compatibility
- Initially target Firefox only
- Structure code to allow Chrome/Edge port later
- Use WebExtension APIs (compatible across browsers)

### Privacy & Security
- All data stored locally (no external servers)
- No tracking or analytics
- No permissions beyond necessary (storage, tabs, sidebar)
- User can export/delete all data

### Performance
- Lazy-load settings page
- Debounce search input if implementing auto-complete
- Limit concurrent tab opens if needed
- Efficient storage operations (minimal writes)

### Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- High-contrast mode support
- Focus management

## References & Resources
- [Firefox Extension Workshop](https://extensionworkshop.com/)
- [MDN WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Tab Groups API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs)
- [Storage API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage)
- [Sidebar API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/sidebarAction)
