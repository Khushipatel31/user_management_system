import { findUserByEmail } from '../data-access/user.db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../config/redis.js';

export async function loginUser({ email, password }) {
    const user = await findUserByEmail(email);

    if (!user || user.is_deleted) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const sessionId = uuidv4();
    const sessionData = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
    };

    await redisClient.setEx(sessionId, 3600, JSON.stringify(sessionData));

    return sessionId;
}
