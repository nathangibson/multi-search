// Storage abstraction layer
// Handles persistence of user preferences using browser.storage.local

import { DEFAULT_SITES } from '../utils/sites.js';

const STORAGE_KEYS = {
  SELECTED_SITES: 'selectedSites',
  SITES: 'sites'
};

export async function loadSelectedSites() {
  try {
    const result = await browser.storage.local.get(STORAGE_KEYS.SELECTED_SITES);
    if (!result.selectedSites || result.selectedSites.length === 0) {
      return DEFAULT_SITES.filter(site => site.enabled).map(site => site.id);
    }
    return result.selectedSites;
  } catch (error) {
    console.error('Failed to load selected sites:', error);
    return DEFAULT_SITES.filter(site => site.enabled).map(site => site.id);
  }
}

export async function saveSelectedSites(siteIds) {
  try {
    await browser.storage.local.set({ [STORAGE_KEYS.SELECTED_SITES]: siteIds });
  } catch (error) {
    console.error('Failed to save selected sites:', error);
  }
}

export async function loadSites() {
  try {
    const result = await browser.storage.local.get(STORAGE_KEYS.SITES);
    if (result.sites == null) {
      return DEFAULT_SITES;
    }
    return result.sites;
  } catch (error) {
    console.error('Failed to load sites:', error);
    return DEFAULT_SITES;
  }
}

export async function saveSites(sites) {
  try {
    await browser.storage.local.set({ [STORAGE_KEYS.SITES]: sites });
  } catch (error) {
    console.error('Failed to save sites:', error);
  }
}

export function getDefaultSites() {
  return DEFAULT_SITES;
}
