const API_BASE_URL = "http://localhost:3002/api";

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
};

export const bookService = {
    getAllBooks: async () => {
        const response = await fetch(`${API_BASE_URL}/books`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Failed to fetch books.");
        return response.json();
    },

    getBookById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/books/${id}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Book not found.");
        return response.json();
    },

    createBook: async (bookData) => {
        const response = await fetch(`${API_BASE_URL}/books`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(bookData)
        });
        if (!response.ok) throw new Error("Failed to create book.");

        return response.json();
    },

    updateBook: async (id, bookData) => {
        const response = await fetch(`${API_BASE_URL}/books/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(bookData)
        });
        if (!response.ok) throw new Error("Failed to update book.");

        return response.json();
    },

    deleteBook: async (id) => {
        const response = await fetch(`${API_BASE_URL}/books/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Failed to delete book.");
    },
};