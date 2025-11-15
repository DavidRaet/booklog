import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg 


const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
})

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection failed: ', err)
    } else {
        console.log('Database connection successful: ', res.rows[0].now)
    }
})


export default pool