// app.js — Lab 3 (Exercises 3.2, 3.3, 3.4)

import { addFavorite, isFavorite } from './favorites.js';
import { fetchFeaturedBooks, searchBooks } from './fetchBooks.js';

// --- Toast ---

function showToast(message, icon = '✓', bgColor = 'bg-green-500') {
  const toast = document.getElementById('toast');
  const msg   = document.getElementById('toast-msg');
  const ico   = document.getElementById('toast-icon');

  if (!toast || !msg || !ico) return;

  msg.textContent = message;
  ico.textContent = icon;

  // Reset color classes then apply new one
  toast.className = toast.className.replace(/bg-\S+/g, '').trim();
  toast.classList.add(bgColor);

  // Slide in
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  // Slide out after 3s
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3000);
}

// --- UI helpers ---

function showLoading(grid, loading, noResults) {
  loading.classList.remove('hidden');
  grid.classList.add('hidden');
  noResults.classList.add('hidden');
}

function hideLoading(grid, loading) {
  loading.classList.add('hidden');
  grid.classList.remove('hidden');
}

function showNoResults(grid, noResults) {
  noResults.classList.remove('hidden');
  grid.classList.add('hidden');
}

function updateCount(sectionTitle, resultCount, count, query = '') {
  if (query) {
    sectionTitle.textContent = `Results for "${query}"`;
    resultCount.textContent = `${count} book${count !== 1 ? 's' : ''} found`;
    resultCount.classList.remove('hidden');
  } else {
    sectionTitle.textContent = 'Featured Books';
    resultCount.classList.add('hidden');
  }
}

// --- Card builder ---

function createBookCard(book) {
  const card = document.createElement('div');
  card.className = 'book-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col w-full';
  card.dataset.id = book.id;

  const favorited = isFavorite(book.id);

  card.innerHTML = `
    <div class="relative overflow-hidden bg-gray-200 h-48 sm:h-64">
      <img src="${book.cover}" alt="${book.title}"
           class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
           onerror="this.src='https://via.placeholder.com/300x400?text=No+Cover'" />
    </div>
    <div class="p-3 sm:p-4 flex flex-col flex-1">
      <h3 class="font-bold text-gray-800 text-xs sm:text-sm mb-1 line-clamp-2">${book.title}</h3>
      <p class="text-gray-500 text-xs mb-3">${book.author}</p>
      <button
        class="fav-btn mt-auto w-full text-white text-xs font-semibold py-2 rounded-md transition-colors duration-200 ${favorited ? 'bg-green-500 cursor-default' : 'bg-navy hover:bg-gold'}"
        data-id="${book.id}"
        data-title="${book.title}"
        data-author="${book.author}"
        data-cover="${book.cover}"
        ${favorited ? 'disabled' : ''}>
        ${favorited ? '✓ Added to Favorites!' : '♡ Add to Favorites'}
      </button>
    </div>
  `;

  return card;
}

function renderBooks(grid, books) {
  grid.innerHTML = '';
  books.forEach(book => grid.appendChild(createBookCard(book)));
}

// --- Favorites toggle ---

function handleFavClick(e) {
  const btn = e.target.closest('.fav-btn');
  if (!btn || btn.disabled) return;

  const book = {
    id:     btn.dataset.id,
    title:  btn.dataset.title,
    author: btn.dataset.author,
    cover:  btn.dataset.cover,
  };

  if (isFavorite(book.id)) return;

  addFavorite(book);
  btn.textContent = '✓ Added to Favorites!';
  btn.className = 'fav-btn mt-auto w-full bg-green-500 text-white text-xs font-semibold py-2 rounded-md transition-colors duration-200 cursor-default';
  btn.disabled = true;

  showToast(`"${book.title}" added to favorites!`, '✓', 'bg-green-500');
}

// --- Mobile menu ---

function initMobileMenu() {
  const btn  = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('hidden'));
}

// --- Init ---

document.addEventListener('DOMContentLoaded', () => {
  const grid         = document.getElementById('books-grid');
  const loading      = document.getElementById('loading');
  const noResults    = document.getElementById('no-results');
  const sectionTitle = document.getElementById('section-title');
  const resultCount  = document.getElementById('result-count');
  const searchForm   = document.getElementById('search-form');
  const searchInput  = document.getElementById('search-input');

  if (!grid) return; // not on homepage

  // Load featured books on page load
  (async () => {
    showLoading(grid, loading, noResults);
    try {
      const books = await fetchFeaturedBooks(12);
      hideLoading(grid, loading);
      books.length === 0
        ? showNoResults(grid, noResults)
        : (renderBooks(grid, books), updateCount(sectionTitle, resultCount, books.length));
    } catch (err) {
      hideLoading(grid, loading);
      showNoResults(grid, noResults);
      console.error('Failed to load featured books:', err);
    }
  })();

  // Search
  searchForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    showLoading(grid, loading, noResults);
    try {
      const books = await searchBooks(query, 12);
      hideLoading(grid, loading);
      books.length === 0
        ? (showNoResults(grid, noResults), updateCount(sectionTitle, resultCount, 0, query))
        : (renderBooks(grid, books), updateCount(sectionTitle, resultCount, books.length, query));
    } catch (err) {
      hideLoading(grid, loading);
      showNoResults(grid, noResults);
      console.error('Search failed:', err);
    }
  });

  grid.addEventListener('click', handleFavClick);
  initMobileMenu();
});
