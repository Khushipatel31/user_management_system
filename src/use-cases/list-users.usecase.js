import { findAllUsers } from '../data-access/user.db.js';

export async function listUsers({ search, sortBy, order, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    return await findAllUsers({ search, sortBy, order, limit, offset });
}
