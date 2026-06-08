// fetchBooks.js — Fetches book data from the Open Library API

const BASE_URL = 'https://openlibrary.org';

// Shared fetch helper — sends request and returns normalized books
async function fetchBooks(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
  return normalizeBooks(data.docs);
}

// Search books by title — displays a maximum of 12 cards
export async function searchBooks(query, limit = 12) {
  const url = `${BASE_URL}/search.json?title=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,cover_i`;
  return fetchBooks(url);
}

// Fetch top-rated fiction books for the homepage — displays a maximum of 12 cards
export async function fetchFeaturedBooks(limit = 12) {
  const url = `${BASE_URL}/search.json?subject=fiction&sort=rating&limit=${limit}&fields=key,title,author_name,cover_i`;
  return fetchBooks(url);
}

// Convert raw API response into a clean book object shape
function normalizeBooks(docs) {
  return docs.map(doc => ({
    id: doc.key ? doc.key.split('/').pop() : crypto.randomUUID(),
    title: doc.title || 'Unknown Title',
    author: doc.author_name?.[0] || 'Unknown Author',
    cover: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : 'https://via.placeholder.com/300x400?text=No+Cover',
  }));
}
