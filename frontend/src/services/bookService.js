/**
 * Book Service
 * 
 * Handles all API calls related to book CRUD operations.
 * Uses centralized API configuration from config/api.js for consistency.
 * 
 * WHY CENTRALIZED CONFIG:
 * - Single source of truth for API base URL
 * - Easy environment switching (dev/staging/prod)
 * - DRY principle - change URL in one place
 */
import apiConfig from '../config/api.js';

const { apiBaseUrl, headers: defaultHeaders } = apiConfig;

/**
 * Builds request headers with authentication token
 * Merges default headers from config with Authorization header
 */
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        ...defaultHeaders,
        "Authorization": token ? `Bearer ${token}` : ""
    };
};

export const bookService = {
    getAllBooks: async () => {
        const response = await fetch(`${apiBaseUrl}/books`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Failed to fetch books.");
        return response.json();
    },

    getBookById: async (id) => {
        const response = await fetch(`${apiBaseUrl}/books/${id}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Book not found.");
        return response.json();
    },

    createBook: async (bookData) => {
        const response = await fetch(`${apiBaseUrl}/books`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(bookData)
        });
        if (!response.ok) throw new Error("Failed to create book.");

        return response.json();
    },

    updateBook: async (id, bookData) => {
        const response = await fetch(`${apiBaseUrl}/books/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(bookData)
        });
        if (!response.ok) throw new Error("Failed to update book.");

        return response.json();
    },

    deleteBook: async (id) => {
        const response = await fetch(`${apiBaseUrl}/books/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Failed to delete book.");
    },
};