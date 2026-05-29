// Storage abstraction layer
// Handles persistence of user preferences using browser.storage.local

import { DEFAULT_SITES, DEFAULT_SITES_BY_MODE } from '../utils/sites.js';

const STORAGE_KEYS = {
  SITES_BY_MODE:          'sitesByMode',
  SELECTED_MODE:          'selectedMode',
  SELECTED_SITES_BY_MODE: 'selectedSitesByMode',
  // Legacy keys (pre-modes) — read-only for migration
  LEGACY_SITES:           'sites',
  LEGACY_SELECTED_SITES:  'selectedSites',
};

// ── Mode selection ────────────────────────────────────────────

export async function loadSelectedMode() {
  try {
    const result = await browser.storage.local.get(STORAGE_KEYS.SELECTED_MODE);
    return result.selectedMode ?? 'bibliography';
  } catch (error) {
    console.error('Failed to load selected mode:', error);
    return 'bibliography';
  }
}

export async function saveSelectedMode(modeId) {
  try {
    await browser.storage.local.set({ [STORAGE_KEYS.SELECTED_MODE]: modeId });
  } catch (error) {
    console.error('Failed to save selected mode:', error);
  }
}

// ── Sites (per mode) ──────────────────────────────────────────

export async function loadSites(modeId) {
  try {
    const result = await browser.storage.local.get([
      STORAGE_KEYS.SITES_BY_MODE,
      STORAGE_KEYS.LEGACY_SITES,
    ]);

    if (result.sitesByMode != null) {
      const modeSites = result.sitesByMode[modeId];
      // null/undefined → default; [] is respected (user cleared intentionally)
      return modeSites ?? DEFAULT_SITES_BY_MODE[modeId] ?? [];
    }

    // Legacy migration: old flat 'sites' key → treat as bibliography
    if (modeId === 'bibliography' && result.sites != null) {
      return result.sites;
    }

    return DEFAULT_SITES_BY_MODE[modeId] ?? [];
  } catch (error) {
    console.error('Failed to load sites:', error);
    return DEFAULT_SITES_BY_MODE[modeId] ?? [];
  }
}

export async function saveSites(modeId, sites) {
  try {
    const result = await browser.storage.local.get(STORAGE_KEYS.SITES_BY_MODE);
    const sitesByMode = result.sitesByMode ?? {};
    sitesByMode[modeId] = sites;
    await browser.storage.local.set({ [STORAGE_KEYS.SITES_BY_MODE]: sitesByMode });
  } catch (error) {
    console.error('Failed to save sites:', error);
  }
}

export function getDefaultSites(modeId) {
  return DEFAULT_SITES_BY_MODE[modeId] ?? [];
}

// ── Selected sites (per mode) ─────────────────────────────────

export async function loadSelectedSites(modeId) {
  try {
    const result = await browser.storage.local.get([
      STORAGE_KEYS.SELECTED_SITES_BY_MODE,
      STORAGE_KEYS.LEGACY_SELECTED_SITES,
    ]);

    if (result.selectedSitesByMode != null) {
      const modeSelected = result.selectedSitesByMode[modeId];
      if (modeSelected && modeSelected.length > 0) return modeSelected;
      // Fall through to default (empty or absent)
    } else if (modeId === 'bibliography' && result.selectedSites?.length > 0) {
      // Legacy migration
      return result.selectedSites;
    }

    // Default: all enabled sites for this mode
    const defaultSites = DEFAULT_SITES_BY_MODE[modeId] ?? [];
    return defaultSites.filter(s => s.enabled).map(s => s.id);
  } catch (error) {
    console.error('Failed to load selected sites:', error);
    const defaultSites = DEFAULT_SITES_BY_MODE[modeId] ?? [];
    return defaultSites.filter(s => s.enabled).map(s => s.id);
  }
}

export async function saveSelectedSites(modeId, siteIds) {
  try {
    const result = await browser.storage.local.get(STORAGE_KEYS.SELECTED_SITES_BY_MODE);
    const selectedSitesByMode = result.selectedSitesByMode ?? {};
    selectedSitesByMode[modeId] = siteIds;
    await browser.storage.local.set({ [STORAGE_KEYS.SELECTED_SITES_BY_MODE]: selectedSitesByMode });
  } catch (error) {
    console.error('Failed to save selected sites:', error);
  }
}

