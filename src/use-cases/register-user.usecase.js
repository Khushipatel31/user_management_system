import { insertUser, findUserByEmail } from '../data-access/user.db.js';
import bcrypt from 'bcrypt';

export async function registerUser({ username, fullname, email, address, password }) {
    const existing = await findUserByEmail(email);
    if (existing) {
        throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await insertUser({
        username,
        fullname,
        email,
        address,
        password: hashedPassword,
    });
}
