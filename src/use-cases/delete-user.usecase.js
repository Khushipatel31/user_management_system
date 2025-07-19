import { softDeleteUser } from '../data-access/user.db.js';

export async function deleteUserProfile({ id, userId }) {
    if (id !== userId) {
        throw new Error("Unauthorized to delete this user.");
    }

    return await softDeleteUser(id);
}
