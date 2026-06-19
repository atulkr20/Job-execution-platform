import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './lib/prisma';
import redisConnection from './lib/redis';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        const redisPing = await redisConnection.ping();

        res.json({
            status: 'ok',
            postgres: 'connected',
            redis: redisPing === 'PONG' ? 'connected' : 'unexpected response',
        });
    } catch (err) {
        console.error('Health check failed:', err);
        res.status(500).json({ status: 'error', message: (err as Error).message});
    }
});

app.listen(PORT, () => {
    console.log(`Job Execution Platform API running on port ${PORT}`);
});