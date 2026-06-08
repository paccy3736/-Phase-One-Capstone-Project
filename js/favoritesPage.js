// favoritesPage.js — Renders and manages the Favorites page

import { getFavorites, removeFavorite } from './favorites.js';

// Build a single favorite card 
function createFavCard(book) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col';
  card.dataset.id = book.id;

  const imgWrapper = document.createElement('div');
  imgWrapper.className = 'relative overflow-hidden bg-gray-200 h-48 sm:h-64';

  const img = document.createElement('img');
  img.src = book.cover;
  img.alt = book.title;
  img.className = 'w-full h-full object-cover hover:scale-105 transition-transform duration-300';
  img.onerror = () => { img.src = 'https://via.placeholder.com/300x400?text=No+Cover'; };

  imgWrapper.appendChild(img);

  const body = document.createElement('div');
  body.className = 'p-3 sm:p-4 flex flex-col flex-1';

  const title = document.createElement('h3');
  title.className = 'font-bold text-gray-800 text-xs sm:text-sm mb-1 line-clamp-2';
  title.textContent = book.title;

  const author = document.createElement('p');
  author.className = 'text-gray-500 text-xs mb-3';
  author.textContent = book.author;

  const btn = document.createElement('button');
  btn.className = 'remove-btn mt-auto w-full bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2 rounded-md transition-colors duration-200';
  btn.dataset.id = book.id;
  btn.textContent = '♥ Remove Favorite';

  body.appendChild(title);
  body.appendChild(author);
  body.appendChild(btn);
  card.appendChild(imgWrapper);
  card.appendChild(body);

  return card;
}

//Render favorites or show empty state 
function renderFavorites() {
  const grid = document.getElementById('favorites-grid');
  const empty = document.getElementById('empty-state');
  const count = document.getElementById('fav-count');
  const favorites = getFavorites();

  grid.innerHTML = '';

  if (favorites.length === 0) {
    empty.classList.remove('hidden');
    count.textContent = '';
  } else {
    empty.classList.add('hidden');
    count.textContent = `${favorites.length} book${favorites.length !== 1 ? 's' : ''} saved`;
    favorites.forEach(book => grid.appendChild(createFavCard(book)));
  }
}

// Handle remove button clicks via event delegation 
function handleRemove(e) {
  const btn = e.target.closest('.remove-btn');
  if (!btn) return;

  removeFavorite(btn.dataset.id);

  // Animate card out then re-render
  const card = btn.closest('[data-id]');
  if (card) {
    card.style.transition = 'opacity 0.3s';
    card.style.opacity = '0';
    setTimeout(renderFavorites, 300);
  }
}

// Mobile menu toggle 
function initMobileMenu() {
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => menu.classList.toggle('hidden'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderFavorites();
  document.getElementById('favorites-grid')?.addEventListener('click', handleRemove);
  initMobileMenu();
});
