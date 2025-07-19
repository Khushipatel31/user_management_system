import { updateUser } from '../data-access/user.db.js';
import bcrypt from 'bcrypt';

export async function updateUserProfile({ id, userId, username, fullname, email, address, password }) {
    if (id !== userId) {
        throw new Error("Unauthorized to update this user.");
    }

    let hashedPassword = null;
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    return await updateUser({
        id,
        username,
        fullname,
        email,
        address,
        password: hashedPassword,
    });
}
