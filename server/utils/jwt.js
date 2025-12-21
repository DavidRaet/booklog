import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({path: '../server/.env.local'});


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';


export const generateToken = (userId) => {
    return jwt.sign(
        { userId: userId },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } 
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch(err) {
        return null;
    }
};



