// app.js — Lab 3 (Exercises 3.2, 3.3, 3.4)
// Populates homepage from Open Library API with search + loading states

import { addFavorite, removeFavorite, isFavorite } from './favorites.js';
import { fetchFeaturedBooks, searchBooks } from './fetchBooks.js';

// DOM refs
const grid        = document.getElementById('books-grid');
const loading     = document.getElementById('loading');
const noResults   = document.getElementById('no-results');
const sectionTitle = document.getElementById('section-title');
const resultCount  = document.getElementById('result-count');
const searchForm  = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// --- UI helpers ---

function showLoading() {
  loading.classList.remove('hidden');
  grid.classList.add('hidden');
  noResults.classList.add('hidden');
}

function hideLoading() {
  loading.classList.add('hidden');
  grid.classList.remove('hidden');
}

function showNoResults() {
  noResults.classList.remove('hidden');
  grid.classList.add('hidden');
}

function updateCount(count, query = '') {
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
  card.className = 'book-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col';
  card.dataset.id = book.id;

  const favorited = isFavorite(book.id);

  card.innerHTML = `
    <div class="relative overflow-hidden bg-gray-200 h-64">
      <img src="${book.cover}" alt="${book.title}"
           class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
           onerror="this.src='https://via.placeholder.com/300x400?text=No+Cover'" />
    </div>
    <div class="p-4 flex flex-col flex-1">
      <h3 class="font-bold text-gray-800 text-sm mb-1 line-clamp-2">${book.title}</h3>
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

function renderBooks(books) {
  grid.innerHTML = '';
  books.forEach(book => grid.appendChild(createBookCard(book)));
}

// --- API calls ---

async function loadFeatured() {
  showLoading();
  try {
    const books = await fetchFeaturedBooks(12);
    hideLoading();
    if (books.length === 0) {
      showNoResults();
    } else {
      renderBooks(books);
      updateCount(books.length);
    }
  } catch (err) {
    hideLoading();
    showNoResults();
    console.error('Failed to load featured books:', err);
  }
}

async function handleSearch(e) {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  showLoading();
  try {
    const books = await searchBooks(query, 12);
    hideLoading();
    if (books.length === 0) {
      showNoResults();
      updateCount(0, query);
    } else {
      renderBooks(books);
      updateCount(books.length, query);
    }
  } catch (err) {
    hideLoading();
    showNoResults();
    console.error('Search failed:', err);
  }
}

// --- Toast notification ---

function showToast(message, type = 'success') {
  const toast   = document.getElementById('toast');
  const toastMsg  = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');

  toastMsg.textContent  = message;
  toastIcon.textContent = type === 'success' ? '♥' : '♡';
  toast.style.backgroundColor = type === 'success' ? '#06b6d4' : '#ef4444';

  // Slide in
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  // Slide out after 3s
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3000);
}

// --- Favorites toggle ---

function handleFavClick(e) {
  const btn = e.target.closest('.fav-btn');
  if (!btn) return;

  const book = {
    id:     btn.dataset.id,
    title:  btn.dataset.title,
    author: btn.dataset.author,
    cover:  btn.dataset.cover,
  };

  if (isFavorite(book.id)) {
    // Already favorited — do nothing on homepage (remove is only on favorites page)
    return;
  } else {
    addFavorite(book);

    // Show confirmation on the button itself
    btn.textContent = '✓ Added to Favorites!';
    btn.className = 'fav-btn mt-auto w-full bg-green-500 text-white text-xs font-semibold py-2 rounded-md transition-colors duration-200 cursor-default';
    btn.disabled = true;
  }
}

// --- Mobile menu ---

function initMobileMenu() {
  const btn  = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('hidden'));
}

// --- Init ---

document.addEventListener('DOMContentLoaded', () => {
  loadFeatured();
  grid?.addEventListener('click', handleFavClick);
  searchForm?.addEventListener('submit', handleSearch);
  initMobileMenu();
});
