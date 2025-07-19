import { redisClient } from '../config/redis.js';

export async function sessionAuth(req, res, next) {
    const sessionId = req.cookies.session_id;
    if (!sessionId) return res.status(401).json({ message: 'Unauthorized' });

    const session = await redisClient.get(sessionId);
    if (!session) return res.status(401).json({ message: 'Invalid session' });

    req.user = JSON.parse(session);
    next();
}
