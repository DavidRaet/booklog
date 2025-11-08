# 📘 BookLog — Iteration Plan: Grid Layout (v1)

## 🎯 Goal
Establish the **foundational layout** for BookLog’s web interface using a **Clean Card Grid** inspired by Airbnb’s design system.  
This iteration focuses purely on **UI structure and CRUD entry points** — no navigation routing or backend integration yet.

The purpose of this iteration:
- Define the core **page hierarchy** and **component structure**.
- Enable basic **client-side book display** and **filtering/search interactions**.
- Lay groundwork for scalable future features (routing, details page, backend API).

---

## 🧱 Layout Skeleton Overview
-----------------------------------------
| [BookCard] [BookCard] [BookCard]      |
| [BookCard] [BookCard] [BookCard]      |
-----------------------------------------


### 🧭 Header (Navigation Bar)
A minimal top bar that anchors the site identity and primary navigation.
-----------------------------------------------------
| BookLog |  [ Home | Library | Favorites ]   | About |
-----------------------------------------------------

**Layout Details:**
- **Left:** App name/logo → “📘 BookLog”
- **Center:** Navigation links (static placeholders)
- **Right:** “About” link
- **Style:** white background, subtle shadow, `flex` alignment  
- **Component:** `<Header />`

---

### 🔍 Search & Filter Section
Located below the header; allows users to find and filter books quickly.
-----------------------------------------------------
| [ Search bar.......... ]  [ Genre ▼ ]  [ Rating ▼ ] |
-----------------------------------------------------


**Functional Goals:**
- **Search:** Filters books by title or author (client-side)
- **Genre Filter:** Filters visible books by genre
- **Rating Filter:** Filters or sorts by rating

**Components:**
- `<SearchBar />`
- `<GenreFilter />`
- `<RatingFilter />`

---

### 🧩 Book Grid Section
Core display area showing all user-added books in clean, card-style layout.
### 🧩 Book Grid Section
-----------------------------------------
| [BookCard] [BookCard] [BookCard]      |
| [BookCard] [BookCard] [BookCard]      |
-----------------------------------------

**Each BookCard Includes:**
- Title (bold)
- Author (smaller, gray text)
- Genre (colored tag)
- Rating (stars or numeric)
- Short review snippet
- Edit/Delete icons (appear on hover)


### ⚙️ Component Hierarchy
<App>
 ├── <Header />
 ├── <SearchFilterBar>
 │     ├── <SearchBar />
 │     ├── <GenreFilter />
 │     └── <RatingFilter />
 ├── <BookGrid>
 │     ├── <BookCard /> × n
 ├── <AddBookButton />
 ├── <AddBookModal /> (hidden by default)
