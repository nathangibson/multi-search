// Sidebar script — search UI logic

import { buildSearchUrl } from '../utils/urlBuilder.js';
import { loadSites, loadSelectedSites, saveSelectedSites, loadSelectedMode, saveSelectedMode, loadLastQuery, saveLastQuery, loadModes } from '../storage/storage.js';

let sites = [];
let currentMode = 'bibliography';

const modeSelect = document.getElementById('mode-select');
const queryInput = document.getElementById('query-input');
const sitesList = document.getElementById('sites-list');
const searchBtn = document.getElementById('search-btn');
const errorMessage = document.getElementById('error-message');

async function init() {
  // Populate mode dropdown
  const modes = await loadModes();
  modes.forEach(mode => {
    const option = document.createElement('option');
    option.value = mode.id;
    option.textContent = mode.name;
    modeSelect.appendChild(option);
  });

  currentMode = await loadSelectedMode();
  modeSelect.value = currentMode;

  await loadModeData();
  queryInput.focus();
}

async function loadModeData() {
  sites = await loadSites(currentMode);
  renderSiteCheckboxes(await loadSelectedSites(currentMode));
  queryInput.value = await loadLastQuery(currentMode);
}

modeSelect.addEventListener('change', async () => {
  currentMode = modeSelect.value;
  await saveSelectedMode(currentMode);
  await loadModeData();
  clearError();
});

function renderSiteCheckboxes(selectedIds) {
  sitesList.innerHTML = '';

  sites
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

async function onSelectionChange() {
  const selectedIds = getCheckedSiteIds();
  await saveSelectedSites(currentMode, selectedIds);
  clearError();
}

searchBtn.addEventListener('click', handleSearch);
queryInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch();
});

async function handleSearch() {
  const query = queryInput.value;
  const selectedIds = getCheckedSiteIds();

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

  await saveLastQuery(currentMode, query.trim());

  const urls = sites
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

document.getElementById('settings-btn')?.addEventListener('click', () => {
  browser.runtime.openOptionsPage();
});

init();
