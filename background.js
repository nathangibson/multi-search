// Background script
// Handles tab creation when user triggers a multi-site search

browser.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'OPEN_SEARCH_TABS') {
    return openSearchTabs(message.urls, message.query);
  }
});

/**
 * Opens each search URL as a new tab in the current window,
 * then groups them together using the Firefox tab groups API.
 * @param {string[]} urls - Array of fully-constructed search URLs
 * @param {string} [query] - The search query used to name the tab group
 */
async function openSearchTabs(urls, query) {
  if (!urls || urls.length === 0) return;

  try {
    // Open all tabs in the current window
    const tabs = await Promise.all(
      urls.map(url => browser.tabs.create({ url, active: false }))
    );

    const tabIds = tabs.map(tab => tab.id);

    // Group the tabs and name the group after the search query
    const groupId = await browser.tabs.group({ tabIds });
    if (query && browser.tabGroups) {
      await browser.tabGroups.update(groupId, { title: query });
    }
    await browser.tabs.update(tabIds[0], { active: true });
  } catch (error) {
    console.error('Failed to open search tabs:', error);
  }
}
