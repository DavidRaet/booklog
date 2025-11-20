import { describe, it, expect } from 'vitest';
import { generateToken, verifyToken } from '../../utils/jwt.js';
describe('JWT Utils', () => {
    describe('generateToken', () => {
        it('should generate a valid token for a user ID', () => {
            const user_id = '123'
            const token = generateToken(user_id)

            expect(token).toBeTypeOf("string")

            expect(token).not.toBeNull()
        });
    });

    describe('verifyToken', () => {
        it('should verify a valid token and return the payload', () => {
            const user_id = "123"
            const token = generateToken(user_id)
        
            const payload = verifyToken(token)
            expect(payload).toHaveProperty('userId', user_id)
        });

        it('should return null for an invalid token', () => {
            const invalidToken = verifyToken('invalid-token')

            expect(invalidToken).toBeNull()
        });
    });
});
