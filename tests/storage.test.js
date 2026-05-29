// tests/storage.test.js
import { loadSites, saveSites, loadSelectedSites, saveSelectedSites, getDefaultSites } from '../storage/storage.js';
import { DEFAULT_SITES } from '../utils/sites.js';

// Helper to override browser.storage.local.get for a single test
function mockGet(returnValue) {
  global.browser.storage.local.get = () => Promise.resolve(returnValue);
}

let lastSet;
function mockSet() {
  global.browser.storage.local.set = (value) => {
    lastSet = value;
    return Promise.resolve();
  };
}

beforeEach(() => {
  lastSet = undefined;
  global.browser.storage.local.get = () => Promise.resolve({});
  global.browser.storage.local.set = (value) => { lastSet = value; return Promise.resolve(); };
});

// ── loadSites ─────────────────────────────────────────────────

describe('loadSites', () => {
  it('returns DEFAULT_SITES when key is absent (result.sites is undefined)', async () => {
    mockGet({});
    const result = await loadSites();
    expect(result).toEqual(DEFAULT_SITES);
  });

  it('returns DEFAULT_SITES when result.sites is null', async () => {
    mockGet({ sites: null });
    const result = await loadSites();
    expect(result).toEqual(DEFAULT_SITES);
  });

  it('returns stored sites array when present', async () => {
    const stored = [{ id: 'a', name: 'A', searchTemplate: 'https://a.com/?q={query}', enabled: true, order: 0 }];
    mockGet({ sites: stored });
    const result = await loadSites();
    expect(result).toEqual(stored);
  });

  it('respects an intentionally empty array [] (does NOT fall back to defaults)', async () => {
    // Regression: old code had `result.sites.length === 0` which wrongly fell back to defaults
    mockGet({ sites: [] });
    const result = await loadSites();
    expect(result).toEqual([]);
  });
});

// ── saveSites ─────────────────────────────────────────────────

describe('saveSites', () => {
  it('writes sites to storage under the "sites" key', async () => {
    const sites = [{ id: 'x', name: 'X', searchTemplate: 'https://x.com/?q={query}', enabled: true, order: 0 }];
    await saveSites(sites);
    expect(lastSet).toEqual({ sites });
  });

  it('can save an empty array', async () => {
    await saveSites([]);
    expect(lastSet).toEqual({ sites: [] });
  });
});

// ── loadSelectedSites ─────────────────────────────────────────

describe('loadSelectedSites', () => {
  it('returns IDs of all enabled DEFAULT_SITES when key is absent', async () => {
    mockGet({});
    const result = await loadSelectedSites();
    const expected = DEFAULT_SITES.filter(s => s.enabled).map(s => s.id);
    expect(result).toEqual(expected);
  });

  it('returns IDs of all enabled DEFAULT_SITES when selectedSites is empty array', async () => {
    mockGet({ selectedSites: [] });
    const result = await loadSelectedSites();
    const expected = DEFAULT_SITES.filter(s => s.enabled).map(s => s.id);
    expect(result).toEqual(expected);
  });

  it('returns stored selectedSites when present and non-empty', async () => {
    mockGet({ selectedSites: ['worldcat', 'ixtheo'] });
    const result = await loadSelectedSites();
    expect(result).toEqual(['worldcat', 'ixtheo']);
  });
});

// ── saveSelectedSites ─────────────────────────────────────────

describe('saveSelectedSites', () => {
  it('writes selectedSites to storage', async () => {
    await saveSelectedSites(['worldcat', 'ixtheo']);
    expect(lastSet).toEqual({ selectedSites: ['worldcat', 'ixtheo'] });
  });
});

// ── getDefaultSites ───────────────────────────────────────────

describe('getDefaultSites', () => {
  it('returns the DEFAULT_SITES constant', () => {
    expect(getDefaultSites()).toEqual(DEFAULT_SITES);
  });

  it('DEFAULT_SITES contains 7 sites', () => {
    expect(getDefaultSites()).toHaveLength(7);
  });

  it('every site has required fields: id, name, searchTemplate containing {query}', () => {
    for (const site of getDefaultSites()) {
      expect(typeof site.id).toBe('string');
      expect(typeof site.name).toBe('string');
      expect(site.searchTemplate).toContain('{query}');
    }
  });
});
