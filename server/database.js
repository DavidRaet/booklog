import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg 


const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT
})

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection failed: ', err)
    } else {
        console.log('Database connection successful: ', res.rows[0].now)
    }
})


export default pool