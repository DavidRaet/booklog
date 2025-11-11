import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'books.json')

export const loadBooks = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8')
        return JSON.parse(data)
    } catch (err) {
        if (err.code === 'ENOENT') return []
        throw err 
    }
}


export const saveBooks = async (books) => {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2))
}