import express from 'express';
import dotenv from 'dotenv';
import pool from './config/db.js';
import { connectRedis } from './config/redis.js';
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import { startCleanupJob } from './cron/cleanup.cron.js';


await connectRedis();

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', async (req, res) => {
    const { rows } = await pool.query('SELECT NOW()');
    res.json({ time: rows[0].now });
});

app.use('/users', userRoutes);

startCleanupJob();

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
