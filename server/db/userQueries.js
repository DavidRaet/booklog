import pool from "../database.js";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const createUser = async (username, email, password) => {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
        `INSERT INTO USERS (username, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, username, email, created_at
        `,
        [username, email, password_hash]
    );

    return result.rows[0];
};


export const getUserByEmail = async (email) => {
    const result = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [email]
    );

    return result.rows[0];
};


export const getUserById = async (id) => {
    const result = await pool.query(`
        SELECT id, username, email, created_at FROM users WHERE id = $1 
        `, [id]
    );

    return result.rows[0];
};

export const confirmPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};