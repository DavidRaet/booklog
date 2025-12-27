import { generateToken, verifyToken } from '../utils/jwt.js';
import LoginSchema  from '../schemas/LoginSchema.js';
import SignUpSchema  from '../schemas/SignUpSchema.js';
import express from 'express';
import {authService} from '../services/authService.js';

const router = express.Router();



router.get('/verify', async (req, res) => {
    const checkValidToken = verifyToken(req.headers.token);
    if(checkValidToken){
        return res.status(200).json({ valid: true, user: checkValidToken });
    } else {
        return res.status(401).json({ valid: false, message: "Invalid or expired token" });
    }
});


router.post('/signup', async (req, res, next) => {
    const validation = SignUpSchema.safeParse(req.body);
    if(!validation.success) {
        return res.status(400).json({
          message: 'Invalid input',
          errors: validation.error.issues
        });
    }
    const { username, email, password } = validation.data;
    try {
        const handleUserSignup = await authService.signup(username, email, password);
        res.status(201).json({
            message: 'User successfully created',
            ...handleUserSignup
        });
    } catch (err) {
        next(err);
    }
});



router.post('/login', async (req, res, next) => {
    const validation = LoginSchema.safeParse(req.body);
    if(!validation.success) {
        return res.status(400).json({
          message: 'Invalid input',
          errors: validation.error.issues
        });
    }
    const { email, password } = validation.data;
    try {
        const handleUserLogin = await authService.login(email, password);
        res.json({
            message: 'Login Successful!',
            ...handleUserLogin
        });
    } catch (err) {
        next(err);
    }
});


export default router;