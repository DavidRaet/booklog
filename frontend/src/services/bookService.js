const API_BASE_URL = "http://localhost:3001/api";

export const bookService = {
    getAllBooks: async () => {
        const response = await fetch(`${API_BASE_URL}/books`);
        if (!response.ok) throw new Error("Failed to fetch books.");
        return response.json();
    },

    getBookById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/books/${id}`);
        if (!response.ok) throw new Error("Book not found.");
        return response.json();
    },

    createBook: async (bookData) => {
        const response = await fetch(`${API_BASE_URL}/books`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookData)
        });
        if (!response.ok) return new Error("Failed to create book.");

        return response.json();
    },

    updateBook: async (id, bookData) => {
        const response = await fetch(`${API_BASE_URL}/books/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookData)
        });
        if (!response.ok) return new Error("Failed to update book.");

        return response.json();
    },

    deleteBook: async (id) => {
        const response = await fetch(`${API_BASE_URL}/books/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) return new Error("Failed to delete book.");
    },
};