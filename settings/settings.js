// Settings page — site management logic

import { loadSites, saveSites, getDefaultSites, loadSelectedMode, saveSelectedMode } from '../storage/storage.js';
import { buildSearchUrl } from '../utils/urlBuilder.js';
import { MODES } from '../utils/sites.js';

// ── DOM refs ─────────────────────────────────────────────────

const modeSelect = document.getElementById('mode-select');
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

let sites = [];
let currentMode = 'bibliography';

// ── Init ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  // Populate mode dropdown
  MODES.forEach(mode => {
    const option = document.createElement('option');
    option.value = mode.id;
    option.textContent = mode.name;
    modeSelect.appendChild(option);
  });

  currentMode = await loadSelectedMode();
  modeSelect.value = currentMode;

  sites = await loadSites(currentMode);
  renderSiteList();
});

modeSelect.addEventListener('change', async () => {
  currentMode = modeSelect.value;
  await saveSelectedMode(currentMode);
  sites = await loadSites(currentMode);
  siteForm.hidden = true;
  renderSiteList();
});

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
  const json = JSON.stringify(sites, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bibliography-sites.json';
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

  if (!Array.isArray(parsed)) {
    showStatus('JSON must be an array of site objects.', 'error');
    return;
  }

  // Validate each entry
  const valid = parsed.filter(s =>
    s && typeof s.id === 'string' && s.id &&
    typeof s.name === 'string' && s.name &&
    typeof s.searchTemplate === 'string' && s.searchTemplate.includes('{query}')
  );

  if (valid.length === 0) {
    showStatus('No valid sites found in file.', 'error');
    return;
  }

  // Upsert: update matching IDs, append new ones
  valid.forEach(incoming => {
    const existing = sites.find(s => s.id === incoming.id);
    if (existing) {
      // Preserve existing order; only update name/template/enabled/baseUrl
      existing.name = incoming.name;
      existing.searchTemplate = incoming.searchTemplate;
      if (incoming.baseUrl) existing.baseUrl = incoming.baseUrl;
      if (typeof incoming.enabled === 'boolean') existing.enabled = incoming.enabled;
    } else {
      sites.push({ ...incoming, order: sites.length });
    }
  });

  persist();
  renderSiteList();
  showStatus(`Imported ${valid.length} site(s).`, 'success');
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
