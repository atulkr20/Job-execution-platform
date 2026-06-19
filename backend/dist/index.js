"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = __importDefault(require("./lib/prisma"));
const redis_1 = __importDefault(require("./lib/redis"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 4000;
app.get('/health', async (req, res) => {
    try {
        await prisma_1.default.$queryRaw `SELECT 1`;
        const redisPing = await redis_1.default.ping();
        res.json({
            status: 'ok',
            postgres: 'connected',
            redis: redisPing === 'PONG' ? 'connected' : 'unexpected response',
        });
    }
    catch (err) {
        console.error('Health check failed:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});
app.listen(PORT, () => {
    console.log(`Job Execution Platform API running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map