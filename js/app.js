// app.js — Exercise 2.3
// Wires DOM events on the homepage for favorites

import { addFavorite, removeFavorite, isFavorite } from './favorites.js';

// Hardcoded book data (Lab 2 — will be replaced by API in Lab 3)
const books = [
  { id: '1',  title: 'Book Title One',    author: 'Author Name', cover: 'images/book1.jpg'  },
  { id: '2',  title: 'Book Title Two',    author: 'Author Name', cover: 'images/book2.jpg'  },
  { id: '3',  title: 'Book Title Three',  author: 'Author Name', cover: 'images/book3.jpg'  },
  { id: '4',  title: 'Book Title Four',   author: 'Author Name', cover: 'images/book4.jpg'  },
  { id: '5',  title: 'Book Title Five',   author: 'Author Name', cover: 'images/book5.jpg'  },
  { id: '6',  title: 'Book Title Six',    author: 'Author Name', cover: 'images/book6.jpg'  },
  { id: '7',  title: 'Book Title Seven',  author: 'Author Name', cover: 'images/book7.jpg'  },
  { id: '8',  title: 'Book Title Eight',  author: 'Author Name', cover: 'images/book8.jpg'  },
  { id: '9',  title: 'Book Title Nine',   author: 'Author Name', cover: 'images/book9.jpg'  },
  { id: '10', title: 'Book Title Ten',    author: 'Author Name', cover: 'images/book10.jpg' },
  { id: '11', title: 'Book Title Eleven', author: 'Author Name', cover: 'images/book11.jpg' },
  { id: '12', title: 'Book Title Twelve', author: 'Author Name', cover: 'images/book12.jpg' },
];

/** Build a single book card element */
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
        class="fav-btn mt-auto w-full text-white text-xs font-semibold py-2 rounded-md transition-colors duration-200 ${favorited ? 'bg-red-500 hover:bg-red-600' : 'bg-navy hover:bg-gold'}"
        data-id="${book.id}">
        ${favorited ? '♥ Remove Favorite' : '♡ Add to Favorites'}
      </button>
    </div>
  `;

  return card;
}

/** Render all book cards into the grid */
function renderBooks() {
  const grid = document.getElementById('books-grid');
  if (!grid) return;
  grid.innerHTML = '';
  books.forEach(book => grid.appendChild(createBookCard(book)));
}

/** Handle favorite button clicks via event delegation */
function handleFavClick(e) {
  const btn = e.target.closest('.fav-btn');
  if (!btn) return;

  const bookId = btn.dataset.id;
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  if (isFavorite(bookId)) {
    removeFavorite(bookId);
    btn.textContent = '♡ Add to Favorites';
    btn.className = 'fav-btn mt-auto w-full bg-navy text-white text-xs font-semibold py-2 rounded-md hover:bg-gold transition-colors duration-200';
  } else {
    addFavorite(book);
    btn.textContent = '♥ Remove Favorite';
    btn.className = 'fav-btn mt-auto w-full bg-red-500 text-white text-xs font-semibold py-2 rounded-md hover:bg-red-600 transition-colors duration-200';
  }
}

/** Mobile menu toggle */
function initMobileMenu() {
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => menu.classList.toggle('hidden'));
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderBooks();
  document.getElementById('books-grid')?.addEventListener('click', handleFavClick);
  initMobileMenu();
});
