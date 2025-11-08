# 📘 Project Requirements Document (PRD)

## Project Name
**BookLog** — Personal Library API + Client

## Objective
Build a full-stack **React + Node.js/Express** application where users can log, view, edit, and delete books from their personal library.  
The project unifies **HTTP + REST fundamentals** and **backend integration** by building both the REST API and React frontend that communicate via JSON.

---

## 🗓️ Phase 2: Learn to Talk to a Backend

### Week 4: HTTP & REST Fundamentals
- Learn how `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` map to CRUD operations  
- Use proper RESTful resource naming and status codes (200, 201, 400, 404, 500)  
- Understand how the client and server communicate through JSON payloads  

### Week 5: Build and Integrate a Mock API
- Design a real REST API using **Node.js + Express**  
- Integrate the API into a **React (Vite)** frontend  
- Implement CRUD functionality using live HTTP requests  

---

## 🧩 Core Features

### 1. Backend (Node.js + Express)
- **Endpoints**
  - `GET /api/books` — fetch all books  
  - `GET /api/books/:id` — fetch a single book  
  - `POST /api/books` — add a new book  
  - `PUT /api/books/:id` — update a book’s details  
  - `DELETE /api/books/:id` — remove a book  
- **Book Schema (example)**
  ```json
  {
    "id": "uuid",
    "title": "The Wind-Up Bird Chronicle",
    "author": "Haruki Murakami",
    "genre": "Fiction",
    "rating": 4.5,
    "review": "Darkly surreal and introspective."
  }
