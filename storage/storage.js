// Storage abstraction layer
// Handles persistence of user preferences using browser.storage.local

import { DEFAULT_SITES } from '../utils/sites.js';

const STORAGE_KEYS = {
  SELECTED_SITES: 'selectedSites'
};

/**
 * Load the list of selected site IDs from storage
 * @returns {Promise<string[]>} Array of site IDs that were last selected
 */
export async function loadSelectedSites() {
  try {
    const result = await browser.storage.local.get(STORAGE_KEYS.SELECTED_SITES);
    
    // If no selection saved, return all enabled sites by default
    if (!result.selectedSites || result.selectedSites.length === 0) {
      return DEFAULT_SITES
        .filter(site => site.enabled)
        .map(site => site.id);
    }
    
    return result.selectedSites;
  } catch (error) {
    console.error('Failed to load selected sites:', error);
    // Fallback: return all enabled sites
    return DEFAULT_SITES
      .filter(site => site.enabled)
      .map(site => site.id);
  }
}

/**
 * Save the list of selected site IDs to storage
 * @param {string[]} siteIds - Array of site IDs to persist
 * @returns {Promise<void>}
 */
export async function saveSelectedSites(siteIds) {
  try {
    await browser.storage.local.set({
      [STORAGE_KEYS.SELECTED_SITES]: siteIds
    });
  } catch (error) {
    console.error('Failed to save selected sites:', error);
    // Fail silently - user selection just won't persist
  }
}

/**
 * Get the default site configurations
 * @returns {Array} Array of site configuration objects
 */
export function getDefaultSites() {
  return DEFAULT_SITES;
}
