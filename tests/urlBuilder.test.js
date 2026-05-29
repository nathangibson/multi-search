// tests/urlBuilder.test.js
import { buildSearchUrl } from '../utils/urlBuilder.js';

describe('buildSearchUrl', () => {
  it('replaces {query} with URL-encoded query', () => {
    const result = buildSearchUrl('https://example.com/search?q={query}', 'hello world');
    expect(result).toBe('https://example.com/search?q=hello%20world');
  });

  it('replaces ALL occurrences of {query} (global regex, not just first)', () => {
    // Regression test: single .replace('{query}', ...) only replaced the first
    const result = buildSearchUrl('https://example.com/?q={query}&also={query}', 'test');
    expect(result).toBe('https://example.com/?q=test&also=test');
  });

  it('replaces {query_raw} with unencoded trimmed query', () => {
    const result = buildSearchUrl('https://example.com/?raw={query_raw}', 'hello world');
    expect(result).toBe('https://example.com/?raw=hello world');
  });

  it('handles both {query} and {query_raw} in same template', () => {
    const result = buildSearchUrl(
      'https://example.com/search?q={query}&display={query_raw}',
      'hello world'
    );
    expect(result).toBe('https://example.com/search?q=hello%20world&display=hello world');
  });

  it('encodes special characters', () => {
    const result = buildSearchUrl('https://example.com/?q={query}', 'a & b < c');
    expect(result).toBe('https://example.com/?q=a%20%26%20b%20%3C%20c');
  });

  it('trims whitespace from query before encoding', () => {
    const result = buildSearchUrl('https://example.com/?q={query}', '  hello  ');
    expect(result).toBe('https://example.com/?q=hello');
  });

  it('handles empty string query', () => {
    const result = buildSearchUrl('https://example.com/?q={query}', '');
    expect(result).toBe('https://example.com/?q=');
  });

  it('leaves template unchanged when no placeholder is present', () => {
    const result = buildSearchUrl('https://example.com/', 'anything');
    expect(result).toBe('https://example.com/');
  });

  it('handles real-world IxTheo template', () => {
    const result = buildSearchUrl(
      'https://ixtheo.de/Search/Results?lookfor={query}',
      'biblical studies'
    );
    expect(result).toBe('https://ixtheo.de/Search/Results?lookfor=biblical%20studies');
  });

  it('handles real-world NLI Rambi template with multiple {query}', () => {
    const result = buildSearchUrl(
      'https://merhav.nli.org.il/primo-explore/search?query=any,contains,{query}&vid=NLI_Rambi',
      'test'
    );
    expect(result).toBe(
      'https://merhav.nli.org.il/primo-explore/search?query=any,contains,test&vid=NLI_Rambi'
    );
  });
});
