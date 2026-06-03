// Settings page — site management logic

import { loadSites, saveSites, getDefaultSites, loadSelectedMode, saveSelectedMode, loadModes, saveModes, deleteMode, loadGroups, saveGroups } from '../storage/storage.js';
import { buildSearchUrl } from '../utils/urlBuilder.js';

// ── DOM refs ─────────────────────────────────────────────────

const modeSelect = document.getElementById('mode-select');
const addModeBtn = document.getElementById('add-mode-btn');
const renameModeBtn = document.getElementById('rename-mode-btn');
const deleteModeBtn = document.getElementById('delete-mode-btn');
const modeForm = document.getElementById('mode-form');
const modeFormTitle = document.getElementById('mode-form-title');
const modeFormName = document.getElementById('mode-form-name');
const modeFormId = document.getElementById('mode-form-id');
const modeFormSave = document.getElementById('mode-form-save');
const modeFormCancel = document.getElementById('mode-form-cancel');

const sitesTbody = document.getElementById('sites-tbody');
const addBtn = document.getElementById('add-btn');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');
const resetBtn = document.getElementById('reset-btn');
const statusMsg = document.getElementById('status-msg');

const siteForm = document.getElementById('site-form');
const formName = document.getElementById('form-name');
const formTemplate = document.getElementById('form-template');
const formId = document.getElementById('form-id');
const formSave = document.getElementById('form-save');
const formCancel = document.getElementById('form-cancel');
const testBtn = document.getElementById('test-btn');

const groupsTbody = document.getElementById('groups-tbody');
const addGroupBtn = document.getElementById('add-group-btn');
const groupForm = document.getElementById('group-form');
const groupFormTitle = document.getElementById('group-form-title');
const groupFormName = document.getElementById('group-form-name');
const groupFormId = document.getElementById('group-form-id');
const groupFormSites = document.getElementById('group-form-sites');
const groupFormSave = document.getElementById('group-form-save');
const groupFormCancel = document.getElementById('group-form-cancel');

let sites = [];
let currentMode = 'bibliography';
let modes = [];
let groups = [];

// ── Init ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  modes = await loadModes();
  currentMode = await loadSelectedMode();

  // Ensure selectedMode is valid; fall back to first mode
  if (!modes.find(m => m.id === currentMode)) {
    currentMode = modes[0]?.id ?? 'bibliography';
  }

  renderModeSelect();

  sites = await loadSites(currentMode);
  groups = await loadGroups(currentMode);
  renderSiteList();
  renderGroupList();
});

modeSelect.addEventListener('change', async () => {
  currentMode = modeSelect.value;
  await saveSelectedMode(currentMode);
  sites = await loadSites(currentMode);
  groups = await loadGroups(currentMode);
  siteForm.hidden = true;
  modeForm.hidden = true;
  groupForm.hidden = true;
  renderSiteList();
  renderGroupList();
});

// ── Mode management ───────────────────────────────────────────

function renderModeSelect() {
  modeSelect.innerHTML = '';
  modes.forEach(mode => {
    const option = document.createElement('option');
    option.value = mode.id;
    option.textContent = mode.name;
    modeSelect.appendChild(option);
  });
  modeSelect.value = currentMode;
  deleteModeBtn.disabled = modes.length <= 1;
}

addModeBtn.addEventListener('click', () => {
  modeFormTitle.textContent = 'Add Mode';
  modeFormName.value = '';
  modeFormId.value = '';
  modeForm.hidden = false;
  modeFormName.focus();
});

renameModeBtn.addEventListener('click', () => {
  const mode = modes.find(m => m.id === currentMode);
  if (!mode) return;
  modeFormTitle.textContent = 'Rename Mode';
  modeFormName.value = mode.name;
  modeFormId.value = mode.id;
  modeForm.hidden = false;
  modeFormName.focus();
});

deleteModeBtn.addEventListener('click', async () => {
  if (modes.length <= 1) {
    showStatus('Cannot delete the last mode.', 'error');
    return;
  }
  const mode = modes.find(m => m.id === currentMode);
  if (!mode) return;
  const confirmed = confirm(
    `Delete mode "${mode.name}"?\n\nThis will permanently remove all search site configurations for this mode. This cannot be undone.`
  );
  if (!confirmed) return;

  const updated = await deleteMode(currentMode);
  if (!updated) {
    showStatus('Failed to delete mode.', 'error');
    return;
  }
  modes = updated;
  currentMode = modes[0].id;
  await saveSelectedMode(currentMode);
  renderModeSelect();
  sites = await loadSites(currentMode);
  siteForm.hidden = true;
  modeForm.hidden = true;
  renderSiteList();
  showStatus(`Mode "${mode.name}" deleted.`, 'success');
});

modeFormSave.addEventListener('click', async () => {
  const name = modeFormName.value.trim();
  if (!name) {
    showStatus('Mode name is required.', 'error');
    modeFormName.focus();
    return;
  }

  const id = modeFormId.value;
  if (id) {
    // Rename existing mode
    const mode = modes.find(m => m.id === id);
    if (mode) mode.name = name;
  } else {
    // Add new mode — generate slug ID, ensure uniqueness
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!slug) slug = `mode-${Date.now()}`;
    if (modes.some(m => m.id === slug)) slug = `${slug}-${Date.now()}`;
    modes.push({ id: slug, name });
    currentMode = slug;
  }

  await saveModes(modes);
  await saveSelectedMode(currentMode);
  renderModeSelect();
  if (!id) {
    sites = await loadSites(currentMode);
    renderSiteList();
  }
  modeForm.hidden = true;
  showStatus(id ? 'Mode renamed.' : 'Mode added.', 'success');
});

modeFormCancel.addEventListener('click', () => {
  modeForm.hidden = true;
});

// ── Group management ──────────────────────────────────────────

function renderGroupList() {
  groupsTbody.innerHTML = '';

  if (groups.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 3;
    td.textContent = 'No groups configured.';
    td.className = 'empty';
    tr.appendChild(td);
    groupsTbody.appendChild(tr);
    return;
  }

  groups.forEach((group, index) => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.textContent = group.name;

    const tdSites = document.createElement('td');
    tdSites.className = 'group-sites-cell';
    const memberNames = group.siteIds
      .map(id => sites.find(s => s.id === id)?.name)
      .filter(Boolean);
    tdSites.textContent = memberNames.length
      ? `${memberNames.length}: ${memberNames.join(', ')}`
      : 'No sites';
    tdSites.title = memberNames.join(', ');

    const tdActions = document.createElement('td');
    tdActions.className = 'actions-cell';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn btn-secondary';
    editBtn.addEventListener('click', () => openEditGroupForm(index));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.addEventListener('click', () => deleteGroup(index));

    tdActions.appendChild(editBtn);
    tdActions.appendChild(deleteBtn);
    tr.append(tdName, tdSites, tdActions);
    groupsTbody.appendChild(tr);
  });
}

addGroupBtn.addEventListener('click', () => {
  groupFormTitle.textContent = 'Add Group';
  groupFormName.value = '';
  groupFormId.value = '';
  renderGroupFormSites([]);
  groupForm.hidden = false;
  groupFormName.focus();
});

function openEditGroupForm(index) {
  const group = groups[index];
  groupFormTitle.textContent = 'Edit Group';
  groupFormName.value = group.name;
  groupFormId.value = group.id;
  renderGroupFormSites(group.siteIds);
  groupForm.hidden = false;
  groupFormName.focus();
}

function renderGroupFormSites(selectedSiteIds) {
  groupFormSites.innerHTML = '';
  const enabledSites = sites.filter(s => s.enabled).sort((a, b) => a.order - b.order);

  if (enabledSites.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No enabled sites available.';
    p.className = 'group-sites-empty';
    groupFormSites.appendChild(p);
    return;
  }

  enabledSites.forEach(site => {
    const label = document.createElement('label');
    label.className = 'group-site-option';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = site.id;
    cb.checked = selectedSiteIds.includes(site.id);

    label.appendChild(cb);
    label.append(` ${site.name}`);
    groupFormSites.appendChild(label);
  });
}

groupFormSave.addEventListener('click', async () => {
  const name = groupFormName.value.trim();
  if (!name) {
    showStatus('Group name is required.', 'error');
    groupFormName.focus();
    return;
  }

  const siteIds = Array.from(groupFormSites.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  const id = groupFormId.value;
  if (id) {
    const group = groups.find(g => g.id === id);
    if (group) {
      group.name = name;
      group.siteIds = siteIds;
    }
  } else {
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!slug) slug = `group-${Date.now()}`;
    if (groups.some(g => g.id === slug)) slug = `${slug}-${Date.now()}`;
    groups.push({ id: slug, name, siteIds });
  }

  await saveGroups(currentMode, groups);
  renderGroupList();
  groupForm.hidden = true;
  showStatus(id ? 'Group saved.' : 'Group added.', 'success');
});

groupFormCancel.addEventListener('click', () => {
  groupForm.hidden = true;
});

function deleteGroup(index) {
  const name = groups[index].name;
  groups.splice(index, 1);
  saveGroups(currentMode, groups);
  renderGroupList();
  showStatus(`Group "${name}" deleted.`, 'success');
}

// ── Render ────────────────────────────────────────────────────

function renderSiteList() {
  sitesTbody.innerHTML = '';

  if (sites.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 5;
    td.textContent = 'No sites configured.';
    td.className = 'empty';
    tr.appendChild(td);
    sitesTbody.appendChild(tr);
    return;
  }

  // Normalize order values to match array position
  sites.forEach((site, i) => { site.order = i; });

  sites.forEach((site, index) => {
    const tr = document.createElement('tr');

    // Name
    const tdName = document.createElement('td');
    tdName.textContent = site.name;

    // Template (truncated)
    const tdTemplate = document.createElement('td');
    tdTemplate.className = 'template-cell';
    tdTemplate.textContent = site.searchTemplate;
    tdTemplate.title = site.searchTemplate;

    // Enabled toggle
    const tdEnabled = document.createElement('td');
    const enabledCb = document.createElement('input');
    enabledCb.type = 'checkbox';
    enabledCb.checked = site.enabled;
    enabledCb.addEventListener('change', () => toggleEnabled(index));
    tdEnabled.appendChild(enabledCb);

    // Order buttons
    const tdOrder = document.createElement('td');
    const upBtn = document.createElement('button');
    upBtn.textContent = '↑';
    upBtn.className = 'btn-icon';
    upBtn.title = 'Move up';
    upBtn.disabled = index === 0;
    upBtn.addEventListener('click', () => moveUp(index));

    const downBtn = document.createElement('button');
    downBtn.textContent = '↓';
    downBtn.className = 'btn-icon';
    downBtn.title = 'Move down';
    downBtn.disabled = index === sites.length - 1;
    downBtn.addEventListener('click', () => moveDown(index));

    tdOrder.style.whiteSpace = 'nowrap';
    tdOrder.appendChild(upBtn);
    tdOrder.appendChild(downBtn);

    // Action buttons
    const tdActions = document.createElement('td');
    tdActions.className = 'actions-cell';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn btn-secondary';
    editBtn.addEventListener('click', () => openEditForm(index));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.addEventListener('click', () => deleteSite(index));

    tdActions.appendChild(editBtn);
    tdActions.appendChild(deleteBtn);

    tr.append(tdName, tdTemplate, tdEnabled, tdOrder, tdActions);
    sitesTbody.appendChild(tr);
  });
}

// ── Site operations ───────────────────────────────────────────

function toggleEnabled(index) {
  sites[index].enabled = !sites[index].enabled;
  persist();
}

function moveUp(index) {
  if (index === 0) return;
  [sites[index - 1], sites[index]] = [sites[index], sites[index - 1]];
  persist();
  renderSiteList();
}

function moveDown(index) {
  if (index === sites.length - 1) return;
  [sites[index], sites[index + 1]] = [sites[index + 1], sites[index]];
  persist();
  renderSiteList();
}

function deleteSite(index) {
  sites.splice(index, 1);
  persist();
  renderSiteList();
  showStatus('Site deleted.', 'success');
}

// ── Add / Edit form ───────────────────────────────────────────

addBtn.addEventListener('click', () => {
  formName.value = '';
  formTemplate.value = '';
  formId.value = '';
  siteForm.hidden = false;
  formName.focus();
});

formCancel.addEventListener('click', () => {
  siteForm.hidden = true;
});

function openEditForm(index) {
  const site = sites[index];
  formName.value = site.name;
  formTemplate.value = site.searchTemplate;
  formId.value = site.id;
  siteForm.hidden = false;
  formName.focus();
}

formSave.addEventListener('click', () => {
  const name = formName.value.trim();
  const template = formTemplate.value.trim();
  const id = formId.value;

  if (!name) {
    showStatus('Site name is required.', 'error');
    formName.focus();
    return;
  }

  if (!template.includes('{query}')) {
    showStatus('Search template must contain {query}.', 'error');
    formTemplate.focus();
    return;
  }

  if (id) {
    // Edit existing
    const site = sites.find(s => s.id === id);
    if (site) {
      site.name = name;
      site.searchTemplate = template;
    }
  } else {
    // Add new — generate slug ID, ensure uniqueness
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (sites.some(s => s.id === slug)) slug = `${slug}-${Date.now()}`;
    sites.push({
      id: slug,
      name,
      baseUrl: '',
      searchTemplate: template,
      enabled: true,
      order: sites.length
    });
  }

  persist();
  renderSiteList();
  siteForm.hidden = true;
  showStatus('Site saved.', 'success');
});

// ── Test button ───────────────────────────────────────────────

testBtn.addEventListener('click', () => {
  const template = formTemplate.value.trim();
  if (!template.includes('{query}')) {
    showStatus('Template must contain {query}.', 'error');
    return;
  }
  const url = buildSearchUrl(template, 'test query');
  browser.tabs.create({ url });
});

// ── Export ────────────────────────────────────────────────────

exportBtn.addEventListener('click', () => {
  const payload = { sites, groups };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'multi-search-config.json';
  a.click();
  URL.revokeObjectURL(url);
  showStatus('Exported.', 'success');
});

// ── Import ────────────────────────────────────────────────────

importBtn.addEventListener('click', () => importFile.click());

importFile.addEventListener('change', async () => {
  const file = importFile.files[0];
  if (!file) return;

  let parsed;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    showStatus('Invalid JSON file.', 'error');
    return;
  }

  // Support legacy format (bare array of sites) and new format ({ sites, groups })
  const rawSites = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.sites) ? parsed.sites : null);
  if (!rawSites) {
    showStatus('JSON must be a sites array or { sites, groups } object.', 'error');
    return;
  }

  // Validate sites
  const validSites = rawSites.filter(s =>
    s && typeof s.id === 'string' && s.id &&
    typeof s.name === 'string' && s.name &&
    typeof s.searchTemplate === 'string' && s.searchTemplate.includes('{query}')
  );

  if (validSites.length === 0) {
    showStatus('No valid sites found in file.', 'error');
    return;
  }

  // Upsert sites: update matching IDs, append new ones
  validSites.forEach(incoming => {
    const existing = sites.find(s => s.id === incoming.id);
    if (existing) {
      existing.name = incoming.name;
      existing.searchTemplate = incoming.searchTemplate;
      if (incoming.baseUrl) existing.baseUrl = incoming.baseUrl;
      if (typeof incoming.enabled === 'boolean') existing.enabled = incoming.enabled;
    } else {
      sites.push({ ...incoming, order: sites.length });
    }
  });

  // Upsert groups (only in new format)
  let importedGroupCount = 0;
  if (!Array.isArray(parsed) && Array.isArray(parsed?.groups)) {
    const validGroups = parsed.groups.filter(g =>
      g && typeof g.id === 'string' && g.id &&
      typeof g.name === 'string' && g.name &&
      Array.isArray(g.siteIds)
    );
    validGroups.forEach(incoming => {
      const existing = groups.find(g => g.id === incoming.id);
      if (existing) {
        existing.name = incoming.name;
        existing.siteIds = incoming.siteIds;
      } else {
        groups.push({ id: incoming.id, name: incoming.name, siteIds: incoming.siteIds });
      }
    });
    importedGroupCount = validGroups.length;
    await saveGroups(currentMode, groups);
    renderGroupList();
  }

  persist();
  renderSiteList();
  const msg = importedGroupCount
    ? `Imported ${validSites.length} site(s) and ${importedGroupCount} group(s).`
    : `Imported ${validSites.length} site(s).`;
  showStatus(msg, 'success');
  importFile.value = '';
});

// ── Reset ─────────────────────────────────────────────────────

resetBtn.addEventListener('click', async () => {
  if (!confirm('Reset all sites to defaults? This cannot be undone.')) return;
  sites = getDefaultSites(currentMode).map((s, i) => ({ ...s, order: i }));
  persist();
  renderSiteList();
  showStatus('Reset to defaults.', 'success');
});

// ── Helpers ───────────────────────────────────────────────────

async function persist() {
  await saveSites(currentMode, sites);
}

let statusTimer;
function showStatus(message, type) {
  statusMsg.textContent = message;
  statusMsg.className = type;
  statusMsg.hidden = false;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { statusMsg.hidden = true; }, 3000);
}
