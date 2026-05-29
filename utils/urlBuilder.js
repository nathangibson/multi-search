// URL Builder Utility
// Constructs search URLs from templates and queries

/**
 * Build a search URL from a template and query string
 * @param {string} template - URL template with placeholders
 * @param {string} query - Search query to insert
 * @returns {string} Complete search URL
 */
export function buildSearchUrl(template, query) {
  // Trim whitespace from query
  const trimmedQuery = query.trim();
  
  // URL-encode the query for use in URLs
  const encodedQuery = encodeURIComponent(trimmedQuery);
  
  // Replace placeholders in template
  return template
    .replace(/\{query\}/g, encodedQuery)
    .replace(/\{query_raw\}/g, trimmedQuery);
}
