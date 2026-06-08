
// fetchBooks.js — Exercise 3.1
// Fetches book data from the Open Library API

const BASE_URL = 'https://openlibrary.org';

/**
 * Search books by title query.
 * Returns an array of normalized book objects.
 * @param {string} query
 * @param {number} limit
 */
export async function searchBooks(query, limit = 12) {
  const url = `${BASE_URL}/search.json?title=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,cover_i`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return normalizeBooks(data.docs);
}

/**
 * Fetch featured/trending books (uses a curated subject).
 * @param {number} limit
 */
export async function fetchFeaturedBooks(limit = 12) {
  const url = `${BASE_URL}/search.json?subject=fiction&sort=rating&limit=${limit}&fields=key,title,author_name,cover_i`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return normalizeBooks(data.docs);
}

/**
 * Normalize raw API docs into a consistent book shape.
 * @param {Array} docs
 */
function normalizeBooks(docs) {
  return docs.map(doc => ({
    id: doc.key?.replace('/works/', '') || crypto.randomUUID(),
    title: doc.title || 'Unknown Title',
    author: doc.author_name?.[0] || 'Unknown Author',
    cover: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : 'https://via.placeholder.com/300x400?text=No+Cover',
  }));
}
