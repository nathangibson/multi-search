// Sidebar script — search UI logic

import { buildSearchUrl } from '../utils/urlBuilder.js';
import { loadSites, loadSelectedSites, saveSelectedSites, loadSelectedMode, saveSelectedMode, loadLastQuery, saveLastQuery, loadModes, loadGroups } from '../storage/storage.js';

let sites = [];
let groups = [];
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
  groups = await loadGroups(currentMode);
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

  const enabledSites = sites
    .filter(site => site.enabled)
    .sort((a, b) => a.order - b.order);

  const activeGroups = groups.filter(g => g.siteIds.some(id => enabledSites.find(s => s.id === id)));

  if (activeGroups.length === 0) {
    // No groups — flat list (original behaviour)
    enabledSites.forEach(site => {
      sitesList.appendChild(makeSiteItem(site, selectedIds.includes(site.id), ''));
    });
    return;
  }

  // Build set of all grouped site IDs
  const groupedIds = new Set(activeGroups.flatMap(g => g.siteIds));

  // Render each group and its members
  activeGroups.forEach(group => {
    const members = group.siteIds
      .map(id => enabledSites.find(s => s.id === id))
      .filter(Boolean);
    if (members.length === 0) return;

    sitesList.appendChild(makeGroupHeader(group, members, selectedIds));
    members.forEach(site => {
      sitesList.appendChild(makeSiteItem(site, selectedIds.includes(site.id), group.id));
    });
  });

  // Ungrouped sites
  const ungrouped = enabledSites.filter(s => !groupedIds.has(s.id));
  if (ungrouped.length > 0) {
    if (activeGroups.length > 0) {
      const divider = document.createElement('li');
      divider.className = 'ungrouped-divider';
      divider.textContent = 'Other';
      sitesList.appendChild(divider);
    }
    ungrouped.forEach(site => {
      sitesList.appendChild(makeSiteItem(site, selectedIds.includes(site.id), ''));
    });
  }
}

function makeSiteItem(site, checked, groupId) {
  const li = document.createElement('li');
  li.className = groupId ? 'group-site' : 'ungrouped-site';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `site-${site.id}-${groupId || 'top'}`;
  checkbox.dataset.siteId = site.id;
  if (groupId) checkbox.dataset.groupId = groupId;
  checkbox.checked = checked;
  checkbox.addEventListener('change', () => onSiteCheckboxChange(site.id, checkbox.checked));

  const label = document.createElement('label');
  label.htmlFor = checkbox.id;
  label.textContent = site.name;

  li.appendChild(checkbox);
  li.appendChild(label);
  return li;
}

function makeGroupHeader(group, members, selectedIds) {
  const li = document.createElement('li');
  li.className = 'group-header';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `group-${group.id}`;
  checkbox.dataset.groupHeaderId = group.id;

  const checkedCount = members.filter(s => selectedIds.includes(s.id)).length;
  if (checkedCount === 0) {
    checkbox.checked = false;
    checkbox.indeterminate = false;
  } else if (checkedCount === members.length) {
    checkbox.checked = true;
    checkbox.indeterminate = false;
  } else {
    checkbox.checked = false;
    checkbox.indeterminate = true;
  }

  checkbox.addEventListener('change', () => onGroupCheckboxChange(group, checkbox.checked));

  const label = document.createElement('label');
  label.htmlFor = checkbox.id;
  label.textContent = group.name;

  li.appendChild(checkbox);
  li.appendChild(label);
  return li;
}

function onSiteCheckboxChange(siteId, checked) {
  // Sync all other checkboxes for this site (it may appear in multiple groups)
  sitesList.querySelectorAll(`input[data-site-id="${siteId}"]`).forEach(cb => {
    cb.checked = checked;
  });
  updateGroupHeaders();
  persistSelection();
  clearError();
}

function onGroupCheckboxChange(group, checked) {
  // Check/uncheck all member site checkboxes
  group.siteIds.forEach(siteId => {
    sitesList.querySelectorAll(`input[data-site-id="${siteId}"]`).forEach(cb => {
      cb.checked = checked;
    });
  });
  updateGroupHeaders();
  persistSelection();
  clearError();
}

function updateGroupHeaders() {
  sitesList.querySelectorAll('input[data-group-header-id]').forEach(headerCb => {
    const groupId = headerCb.dataset.groupHeaderId;
    const memberCbs = Array.from(sitesList.querySelectorAll(`input[data-group-id="${groupId}"]`));
    if (memberCbs.length === 0) return;
    const checkedCount = memberCbs.filter(cb => cb.checked).length;
    if (checkedCount === 0) {
      headerCb.checked = false;
      headerCb.indeterminate = false;
    } else if (checkedCount === memberCbs.length) {
      headerCb.checked = true;
      headerCb.indeterminate = false;
    } else {
      headerCb.checked = false;
      headerCb.indeterminate = true;
    }
  });
}

async function persistSelection() {
  const selectedIds = getCheckedSiteIds();
  await saveSelectedSites(currentMode, selectedIds);
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
    await browser.runtime.sendMessage({ type: 'OPEN_SEARCH_TABS', urls, query: query.trim() });
  } catch (error) {
    console.error('Failed to send search message:', error);
    showError('Could not open search tabs. Please try again.');
  }
}

function getCheckedSiteIds() {
  const ids = new Set(
    Array.from(sitesList.querySelectorAll('input[data-site-id]:checked'))
      .map(cb => cb.dataset.siteId)
  );
  return [...ids];
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
