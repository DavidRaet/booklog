import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../index.js';
import pool from '../../database.js';

describe('Health Check Integration', () => {

    afterAll(async () => {
        await pool.end();
    });

    describe('GET /health', () => {
        it('should return 200 when server is healthy', async () => {
            const res = await request(app).get('/health');

            expect(res.status).toBe(200);
        });

        it('should return correct response structure', async () => {
            const res = await request(app).get('/health');

            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('timestamp');
            expect(res.body).toHaveProperty('uptime');
            expect(res.body).toHaveProperty('checks');
        });

        it('should return "healthy" status when all systems are operational', async () => {
            const res = await request(app).get('/health');

            expect(res.body.status).toBe('healthy');
        });

        it('should include database check in response', async () => {
            const res = await request(app).get('/health');

            expect(res.body.checks).toHaveProperty('database');
            expect(res.body.checks.database).toHaveProperty('status');
        });

        it('should include database latency when healthy', async () => {
            const res = await request(app).get('/health');

            if (res.body.checks.database.status === 'healthy') {
                expect(res.body.checks.database).toHaveProperty('latency');
                expect(typeof res.body.checks.database.latency).toBe('number');
            }
        });

        it('should include valid timestamp', async () => {
            const res = await request(app).get('/health');

            expect(res.body.timestamp).toBeDefined();
            const timestamp = new Date(res.body.timestamp);
            expect(timestamp).toBeInstanceOf(Date);
            expect(isNaN(timestamp.getTime())).toBe(false);
        });

        it('should include uptime as a number', async () => {
            const res = await request(app).get('/health');

            expect(typeof res.body.uptime).toBe('number');
            expect(res.body.uptime).toBeGreaterThanOrEqual(0);
        });

        it('should not require authentication', async () => {
            // Health endpoint should be accessible without any auth token
            const res = await request(app).get('/health');

            expect(res.status).not.toBe(401);
            expect(res.status).not.toBe(403);
        });

        it('should return reasonable database latency (< 1000ms)', async () => {
            const res = await request(app).get('/health');

            if (res.body.checks.database.latency !== undefined) {
                expect(res.body.checks.database.latency).toBeLessThan(1000);
            }
        });

        it('should have Content-Type application/json', async () => {
            const res = await request(app).get('/health');

            expect(res.headers['content-type']).toContain('application/json');
        });
    });
});
