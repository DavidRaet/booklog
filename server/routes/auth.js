import * as userQueries from '../db/userQueries.js'
import { generateToken, verifyToken } from '../utils/jwt.js'
import LoginSchema  from '../schemas/LoginSchema.js'
import SignUpSchema  from '../schemas/SignUpSchema.js'
import express from 'express'


const router = express.Router()



router.get('/verify', async (req, res) => {
    const checkValidToken = verifyToken(req.headers.token)
    if(checkValidToken){
        return res.status(200).json({ valid: true, user: checkValidToken })
    } else {
        return res.status(401).json({ valid: false, message: "Invalid or expired token" })
    }
})

router.post('/signup', async (req, res) => {
    const validation = SignUpSchema.safeParse(req.body)

    if(!validation.success) {
        return res.status(400).json({
          message: 'Invalid input',
          errors: validation.error.issues
        })
    }

    const { username, email, password } = validation.data

    try {
        const existingUser = await userQueries.getUserByEmail(email)
        if(existingUser) {
            return res.status(409).json({ message: 'Email is already registered' })
        }

        const user = await userQueries.createUser(username, email, password)

        const token = generateToken(user.id)

        res.status(201).json({
            message: 'User successfully created',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        console.error('Signup error:', err)
        return res.status(500).json({ message: 'Failed to create user' })
    }
})


router.post('/login', async (req, res) => {
    const validation = LoginSchema.safeParse(req.body)

    if(!validation.success) {
        return res.status(400).json({
          message: 'Invalid input',
          errors: validation.error.issues
        })
    }

    const { email, password } = validation.data 
    
    try {
        const user = await userQueries.getUserByEmail(email)

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const isValidPassword = await userQueries.confirmPassword(password, user.password_hash)

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const token = generateToken(user.id)

        res.json({
            message: 'Login Successful!',
            token, 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        })
    } catch (err) {
        return res.status(500).json({ message: 'Login failed' })
    }

})


export default router