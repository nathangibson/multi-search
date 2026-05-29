// Sidebar script — search UI logic

import { DEFAULT_SITES } from '../utils/sites.js';
import { buildSearchUrl } from '../utils/urlBuilder.js';
import { loadSelectedSites, saveSelectedSites } from '../storage/storage.js';

const queryInput = document.getElementById('query-input');
const sitesList = document.getElementById('sites-list');
const searchBtn = document.getElementById('search-btn');
const errorMessage = document.getElementById('error-message');

// ── Initialisation ──────────────────────────────────────────

async function init() {
  const selectedIds = await loadSelectedSites();
  renderSiteCheckboxes(selectedIds);
  queryInput.focus();
}

// ── Render checkboxes ───────────────────────────────────────

function renderSiteCheckboxes(selectedIds) {
  sitesList.innerHTML = '';

  DEFAULT_SITES
    .filter(site => site.enabled)
    .sort((a, b) => a.order - b.order)
    .forEach(site => {
      const li = document.createElement('li');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `site-${site.id}`;
      checkbox.value = site.id;
      checkbox.checked = selectedIds.includes(site.id);
      checkbox.addEventListener('change', onSelectionChange);

      const label = document.createElement('label');
      label.htmlFor = `site-${site.id}`;
      label.textContent = site.name;

      li.appendChild(checkbox);
      li.appendChild(label);
      sitesList.appendChild(li);
    });
}

// ── Persist checkbox state when user changes selection ──────

async function onSelectionChange() {
  const selectedIds = getCheckedSiteIds();
  await saveSelectedSites(selectedIds);
  clearError();
}

// ── Search button handler ───────────────────────────────────

searchBtn.addEventListener('click', handleSearch);
queryInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch();
});

async function handleSearch() {
  const query = queryInput.value;
  const selectedIds = getCheckedSiteIds();

  // Validate inputs
  if (!query.trim()) {
    showError('Please enter a search query.');
    queryInput.focus();
    return;
  }

  if (selectedIds.length === 0) {
    showError('Please select at least one site.');
    return;
  }

  clearError();

  // Build search URLs for selected, enabled sites
  const urls = DEFAULT_SITES
    .filter(site => selectedIds.includes(site.id) && site.enabled)
    .sort((a, b) => a.order - b.order)
    .map(site => buildSearchUrl(site.searchTemplate, query));

  if (urls.length === 0) {
    showError('No valid sites selected.');
    return;
  }

  try {
    await browser.runtime.sendMessage({ type: 'OPEN_SEARCH_TABS', urls });
  } catch (error) {
    console.error('Failed to send search message:', error);
    showError('Could not open search tabs. Please try again.');
  }
}

// ── Helpers ─────────────────────────────────────────────────

function getCheckedSiteIds() {
  return Array.from(sitesList.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.value);
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.hidden = true;
}

// ── Start ────────────────────────────────────────────────────

init();
