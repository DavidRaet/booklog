import pool from "../database.js";


export const getAllBooks = async () => {
    const result = await pool.query('SELECT * FROM books ORDER BY created_at DESC')
    return result.rows
} 

export const getBookById = async (id) => {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id])

    return result.rows[0]
}

export const createBook = async (book) => {
    const { title, author, genre, rating, review } = book 

    const result = await pool.query(
        `INSERT INTO books (title, author, genre, rating, review) 
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [title, author, genre, rating, review]
    )
    return result.rows[0]
} 



export const updateBook = async (id, book) => {
    const { title, author, genre, rating, review } = book 

    const result = await pool.query(
        `UPDATE books 
         SET title = $1, author = $2, genre = $3, rating = $4, review = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *
        `,
        [title, author, genre, rating, review, id]
    )

    return result.rows[0]
} 

export const deleteBook = async (id) => {
    await pool.query('DELETE FROM books where id = $1', [id])
}