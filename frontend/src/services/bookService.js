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
    }


}