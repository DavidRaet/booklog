import { verifyToken } from '../utils/jwt.js'


export const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token){
        return res.status(401).json({ message: 'Access token required' })
    }

    const decoded = verifyToken(token)

    if (!decoded){
        return res.status(403).json({ message: 'Invalid or expired token' })
    }

    req.userId = decoded.userId
    next()
}