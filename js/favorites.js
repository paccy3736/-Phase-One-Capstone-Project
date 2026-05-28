// favorites.js — Exercise 2.2 & 2.4
// Manages favorites using localStorage

const STORAGE_KEY = 'bookExplorerFavorites';

/** Return all favorites from localStorage */
export function getFavorites() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

/** Add a book object to favorites (no duplicates) */
export function addFavorite(book) {
  const favorites = getFavorites();
  const exists = favorites.some(b => b.id === book.id);
  if (!exists) {
    favorites.push(book);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }
}

/** Remove a book by id from favorites */
export function removeFavorite(bookId) {
  const updated = getFavorites().filter(b => b.id !== bookId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/** Check if a book is already in favorites */
export function isFavorite(bookId) {
  return getFavorites().some(b => b.id === bookId);
}
