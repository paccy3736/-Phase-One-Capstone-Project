// app.js — Lab 3 (Exercises 3.2, 3.3, 3.4)

import { addFavorite, isFavorite } from './favorites.js';
import { fetchFeaturedBooks, searchBooks } from './fetchBooks.js';

// ─── UI Helpers ──────────────────────────────────────────────────────────────

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

function showToast(message, icon = '✓') {
  const toast = document.getElementById('toast');
  const msg   = document.getElementById('toast-msg');
  const ico   = document.getElementById('toast-icon');

  if (!toast || !msg || !ico) return;

  msg.textContent = message;
  ico.textContent = icon;

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

// ─── Card Builder ─────────────────────────────────────────────────────────────

function createBookCard(book) {
  const favorited = isFavorite(book.id);

  // Card container
  const card = document.createElement('div');
  card.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col w-full';
  card.dataset.id = book.id;

  // Cover image
  const imgWrapper = document.createElement('div');
  imgWrapper.className = 'relative overflow-hidden bg-gray-200 h-48 sm:h-64';

  const img = document.createElement('img');
  img.src = book.cover;
  img.alt = book.title;
  img.className = 'w-full h-full object-cover hover:scale-105 transition-transform duration-300';
  img.onerror = () => { img.src = 'https://via.placeholder.com/300x400?text=No+Cover'; };

  imgWrapper.appendChild(img);

  // Text content
  const body = document.createElement('div');
  body.className = 'p-3 sm:p-4 flex flex-col flex-1';

  const title = document.createElement('h3');
  title.className = 'font-bold text-gray-800 text-xs sm:text-sm mb-1 line-clamp-2';
  title.textContent = book.title;

  const author = document.createElement('p');
  author.className = 'text-gray-500 text-xs mb-3';
  author.textContent = book.author;

  // Favorites button
  const btn = document.createElement('button');
  btn.className = 'fav-btn mt-auto w-full text-white text-xs font-semibold py-2 rounded-md transition-colors duration-200';
  btn.dataset.id     = book.id;
  btn.dataset.title  = book.title;
  btn.dataset.author = book.author;
  btn.dataset.cover  = book.cover;

  if (favorited) {
    btn.textContent = '✓ Added to Favorites!';
    btn.classList.add('bg-green-500', 'cursor-default');
    btn.disabled = true;
  } else {
    btn.textContent = '♡ Add to Favorites';
    btn.classList.add('bg-gray-900', 'hover:bg-cyan-500');
  }

  // Assemble the card
  body.appendChild(title);
  body.appendChild(author);
  body.appendChild(btn);
  card.appendChild(imgWrapper);
  card.appendChild(body);

  return card;
}

function renderBooks(grid, books) {
  grid.innerHTML = '';
  books.forEach(book => grid.appendChild(createBookCard(book)));
}

// ─── Event Handlers ───────────────────────────────────────────────────────────

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

  showToast(`"${book.title}" added to favorites!`);
}

function initMobileMenu() {
  const btn  = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('hidden'));
}


document.addEventListener('DOMContentLoaded', () => {
  const grid         = document.getElementById('books-grid');
  const loading      = document.getElementById('loading');
  const noResults    = document.getElementById('no-results');
  const sectionTitle = document.getElementById('section-title');
  const resultCount  = document.getElementById('result-count');
  const searchForm   = document.getElementById('search-form');
  const searchInput  = document.getElementById('search-input');

  if (!grid) return; 

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
  searchForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const query = searchInput.value.trim();

    if (!query) return;

    showLoading(grid, loading, noResults);

    try {
      const books = await searchBooks(query, 12);

      hideLoading(grid, loading);

      if (books.length === 0) {
        showNoResults(grid, noResults);
        updateCount(sectionTitle, resultCount, 0, query);
      } else {
        renderBooks(grid, books);
        updateCount(sectionTitle, resultCount, books.length, query);
      }

    } catch (err) {
      hideLoading(grid, loading);
      showNoResults(grid, noResults);
      console.error('Search failed:', err);
    }
  });

  grid.addEventListener('click', handleFavClick);
  initMobileMenu();
});
