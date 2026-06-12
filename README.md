# 📚 Book Explorer

A responsive, interactive web application that lets you search millions of books, save your favourites, and discover new titles — powered by the [Open Library API](https://openlibrary.org).

Built as a Phase One Capstone Project.

---

1.Features

- **Search Books** — Search by title across millions of books from the Open Library database
- **Featured Books** — Homepage displays top-rated fiction books on load
- **Save Favourites** — Add books to your personal favourites list
- **Remove Favourites** — Remove books from your favourites page
- **Persistent Storage** — Favourites are saved in localStorage and persist on page refresh
- **Toast Notifications** — Visual feedback when a book is added to favourites
- **Loading States** — Spinner shown while fetching data from the API
- **No Results State** — Friendly message when no books match the search
- **Fully Responsive** — Works on mobile, tablet, and desktop using mobile-first design

---

2.Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and layout |
| Tailwind CSS (CDN) | Styling and responsive design |
| JavaScript (ES6 Modules) | Interactivity and logic |
| Open Library API | Book data (titles, authors, covers) |
| localStorage | Persisting favourites across sessions |

---

 3.Project Structure

```
├── index.html          # Homepage — search and featured books
├── favorites.html      # Favourites page
├── about.html          # About page
└── js/
    ├── app.js          # Homepage logic (cards, search, toast)
    ├── favorites.js    # localStorage module (add, remove, check)
    ├── favoritesPage.js # Favourites page logic
    └── fetchBooks.js   # API module (search and featured books)
```

---

 4.API Used

**Open Library API** — [https://openlibrary.org](https://openlibrary.org)

- Featured books endpoint: `/search.json?subject=fiction&sort=rating`
- Search endpoint: `/search.json?title={query}`
- Cover images: `https://covers.openlibrary.org/b/id/{cover_id}-M.jpg`

---

 5.How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/paccy3736/-Phase-One-Capstone-Project.git
   ```
2. Open the project folder
3. Open `index.html` in your browser

No installation or build step required — the project runs directly in the browser.

---

 6.Developer

Built by **Pascaline** — Phase One Capstone Project
