// tests/storage.test.js
import {
  loadSites, saveSites,
  loadSelectedSites, saveSelectedSites,
  loadSelectedMode, saveSelectedMode,
  loadLastQuery, saveLastQuery,
  getDefaultSites,
} from '../storage/storage.js';
import { DEFAULT_SITES, DEFAULT_SITES_BY_MODE, DEFAULT_GROUPS_BY_MODE } from '../utils/sites.js';

let lastSet;

beforeEach(() => {
  lastSet = undefined;
  global.browser.storage.local.get = () => Promise.resolve({});
  global.browser.storage.local.set = (value) => { lastSet = value; return Promise.resolve(); };
});

// ── loadSites ─────────────────────────────────────────────────

describe('loadSites', () => {
  it('returns DEFAULT_SITES for bibliography when sitesByMode is absent', async () => {
    global.browser.storage.local.get = () => Promise.resolve({});
    const result = await loadSites('bibliography');
    expect(result).toEqual(DEFAULT_SITES);
  });

  it('returns DEFAULT_SITES_BY_MODE.images for images when sitesByMode is absent', async () => {
    global.browser.storage.local.get = () => Promise.resolve({});
    const result = await loadSites('images');
    expect(result).toEqual(DEFAULT_SITES_BY_MODE.images);
  });

  it('returns stored sites for the requested mode', async () => {
    const stored = [{ id: 'a', name: 'A', searchTemplate: 'https://a.com/?q={query}', enabled: true, order: 0 }];
    global.browser.storage.local.get = () => Promise.resolve({ sitesByMode: { bibliography: stored } });
    const result = await loadSites('bibliography');
    expect(result).toEqual(stored);
  });

  it('respects an intentionally empty array [] for a mode', async () => {
    global.browser.storage.local.get = () => Promise.resolve({ sitesByMode: { bibliography: [] } });
    const result = await loadSites('bibliography');
    expect(result).toEqual([]);
  });

  it('uses legacy "sites" key as bibliography when sitesByMode is absent', async () => {
    const legacy = [{ id: 'old', name: 'Old', searchTemplate: 'https://old.com/?q={query}', enabled: true, order: 0 }];
    global.browser.storage.local.get = () => Promise.resolve({ sites: legacy });
    const result = await loadSites('bibliography');
    expect(result).toEqual(legacy);
  });

  it('does NOT apply legacy "sites" key to non-bibliography modes', async () => {
    const legacy = [{ id: 'old', name: 'Old', searchTemplate: 'https://old.com/?q={query}', enabled: true, order: 0 }];
    global.browser.storage.local.get = () => Promise.resolve({ sites: legacy });
    const result = await loadSites('images');
    expect(result).toEqual(DEFAULT_SITES_BY_MODE.images);
  });
});

// ── saveSites ─────────────────────────────────────────────────

describe('saveSites', () => {
  it('merges into sitesByMode and writes to storage', async () => {
    const existing = { images: [{ id: 'img1' }] };
    global.browser.storage.local.get = () => Promise.resolve({ sitesByMode: existing });
    const newSites = [{ id: 'x', name: 'X', searchTemplate: 'https://x.com/?q={query}', enabled: true, order: 0 }];
    await saveSites('bibliography', newSites);
    expect(lastSet).toEqual({ sitesByMode: { images: [{ id: 'img1' }], bibliography: newSites } });
  });

  it('can save an empty array for a mode', async () => {
    global.browser.storage.local.get = () => Promise.resolve({});
    await saveSites('shopping', []);
    expect(lastSet).toEqual({ sitesByMode: { shopping: [] } });
  });
});

// ── loadSelectedMode / saveSelectedMode ───────────────────────

describe('loadSelectedMode', () => {
  it('returns "bibliography" when key is absent', async () => {
    global.browser.storage.local.get = () => Promise.resolve({});
    expect(await loadSelectedMode()).toBe('bibliography');
  });

  it('returns stored mode when present', async () => {
    global.browser.storage.local.get = () => Promise.resolve({ selectedMode: 'shopping' });
    expect(await loadSelectedMode()).toBe('shopping');
  });
});

describe('saveSelectedMode', () => {
  it('writes selectedMode to storage', async () => {
    await saveSelectedMode('manuscripts');
    expect(lastSet).toEqual({ selectedMode: 'manuscripts' });
  });
});

// ── loadSelectedSites ─────────────────────────────────────────

describe('loadSelectedSites', () => {
  it('returns IDs of all enabled DEFAULT_SITES for bibliography when absent', async () => {
    global.browser.storage.local.get = () => Promise.resolve({});
    const result = await loadSelectedSites('bibliography');
    const expected = DEFAULT_SITES.filter(s => s.enabled).map(s => s.id);
    expect(result).toEqual(expected);
  });

  it('falls back to enabled defaults for images when absent', async () => {
    global.browser.storage.local.get = () => Promise.resolve({});
    const result = await loadSelectedSites('images');
    const expected = DEFAULT_SITES_BY_MODE.images.filter(s => s.enabled).map(s => s.id);
    expect(result).toEqual(expected);
  });

  it('returns stored selectedSites for the mode when present and non-empty', async () => {
    global.browser.storage.local.get = () =>
      Promise.resolve({ selectedSitesByMode: { bibliography: ['worldcat', 'ixtheo'] } });
    const result = await loadSelectedSites('bibliography');
    expect(result).toEqual(['worldcat', 'ixtheo']);
  });

  it('uses legacy "selectedSites" for bibliography when selectedSitesByMode is absent', async () => {
    global.browser.storage.local.get = () =>
      Promise.resolve({ selectedSites: ['worldcat'] });
    const result = await loadSelectedSites('bibliography');
    expect(result).toEqual(['worldcat']);
  });
});

// ── saveSelectedSites ─────────────────────────────────────────

describe('saveSelectedSites', () => {
  it('merges into selectedSitesByMode and writes to storage', async () => {
    global.browser.storage.local.get = () =>
      Promise.resolve({ selectedSitesByMode: { images: ['img1'] } });
    await saveSelectedSites('bibliography', ['worldcat', 'ixtheo']);
    expect(lastSet).toEqual({
      selectedSitesByMode: { images: ['img1'], bibliography: ['worldcat', 'ixtheo'] },
    });
  });
});

// ── getDefaultSites ───────────────────────────────────────────

describe('getDefaultSites', () => {
  it('returns DEFAULT_SITES for bibliography', () => {
    expect(getDefaultSites('bibliography')).toEqual(DEFAULT_SITES);
  });

  it('returns the mode defaults for all shipped modes', () => {
    for (const [modeId, sites] of Object.entries(DEFAULT_SITES_BY_MODE)) {
      expect(getDefaultSites(modeId)).toEqual(sites);
    }
  });

  it('bibliography has 6 sites (per sites/bibliography.json)', () => {
    expect(getDefaultSites('bibliography')).toHaveLength(6);
  });

  it('every site in every mode has id, name, searchTemplate with {query}', () => {
    for (const sites of Object.values(DEFAULT_SITES_BY_MODE)) {
      for (const site of sites) {
        expect(typeof site.id).toBe('string');
        expect(typeof site.name).toBe('string');
        expect(site.searchTemplate).toContain('{query}');
      }
    }
  });

  it('default groups reference existing site IDs in their mode', () => {
    for (const [modeId, groups] of Object.entries(DEFAULT_GROUPS_BY_MODE)) {
      const siteIds = new Set(getDefaultSites(modeId).map(s => s.id));
      for (const group of groups) {
        expect(typeof group.id).toBe('string');
        expect(typeof group.name).toBe('string');
        for (const siteId of group.siteIds) {
          expect(siteIds.has(siteId)).toBe(true);
        }
      }
    }
  });
});

// ── loadLastQuery ─────────────────────────────────────────────

describe('loadLastQuery', () => {
  it('returns empty string when no data stored', async () => {
    const result = await loadLastQuery('bibliography');
    expect(result).toBe('');
  });

  it('returns stored query for the mode', async () => {
    global.browser.storage.local.get = () =>
      Promise.resolve({ lastQueryByMode: { bibliography: 'medieval manuscripts' } });
    const result = await loadLastQuery('bibliography');
    expect(result).toBe('medieval manuscripts');
  });

  it('returns empty string for a different mode with no data', async () => {
    global.browser.storage.local.get = () =>
      Promise.resolve({ lastQueryByMode: { bibliography: 'something' } });
    const result = await loadLastQuery('images');
    expect(result).toBe('');
  });

  it('returns empty string on storage error', async () => {
    global.browser.storage.local.get = () => Promise.reject(new Error('storage fail'));
    const result = await loadLastQuery('bibliography');
    expect(result).toBe('');
  });
});

// ── saveLastQuery ─────────────────────────────────────────────

describe('saveLastQuery', () => {
  it('saves query for a mode when no prior data exists', async () => {
    await saveLastQuery('bibliography', 'gutenberg');
    expect(lastSet).toEqual({ lastQueryByMode: { bibliography: 'gutenberg' } });
  });

  it('preserves queries for other modes when saving', async () => {
    global.browser.storage.local.get = () =>
      Promise.resolve({ lastQueryByMode: { images: 'illuminated' } });
    await saveLastQuery('bibliography', 'gutenberg');
    expect(lastSet).toEqual({
      lastQueryByMode: { images: 'illuminated', bibliography: 'gutenberg' },
    });
  });

  it('overwrites previous query for the same mode', async () => {
    global.browser.storage.local.get = () =>
      Promise.resolve({ lastQueryByMode: { bibliography: 'old query' } });
    await saveLastQuery('bibliography', 'new query');
    expect(lastSet).toEqual({ lastQueryByMode: { bibliography: 'new query' } });
  });

  it('does not throw on storage error', async () => {
    global.browser.storage.local.get = () => Promise.reject(new Error('storage fail'));
    await expect(saveLastQuery('bibliography', 'test')).resolves.toBeUndefined();
  });
});
