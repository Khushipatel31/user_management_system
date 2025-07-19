import pool from '../config/db.js';

export async function insertUser({ username, fullname, email, address, password }) {
    const query = `
        INSERT INTO users (username, fullname, email, address, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, email, fullname, address
    `;
    const values = [username, fullname, email, address, password];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

export async function findUserByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1 AND is_deleted = false`;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
}

export async function findAllUsers({ search, sortBy, order, limit, offset }) {
    const searchTerm = search || '';
    const sort = sortBy || 'created_at';
    const direction = order === 'asc' ? 'ASC' : 'DESC';

    const query = `
        SELECT id, username, fullname, email, address, created_at
        FROM users
        WHERE is_deleted = false
        AND (
            username ILIKE $1
            OR to_tsvector('english', fullname || ' ' || address) @@ plainto_tsquery('english', $2)
            OR email ILIKE $1
        )
        ORDER BY ${sort} ${direction}
        LIMIT $3 OFFSET $4
    `;

    const values = [`%${searchTerm}%`, searchTerm, limit, offset];
    const { rows } = await pool.query(query, values);
    return rows;
}

export async function updateUser({ id, username, fullname, email, address, password }) {
    let query = `
        UPDATE users
        SET username = $1,
            fullname = $2,
            email = $3,
            address = $4,
    `;

    const values = [username, fullname, email, address];

    if (password) {
        query += `password = $5, `;
        values.push(password);
    }

    query += `updated_at = NOW() WHERE id = $${values.length + 1} AND is_deleted = false RETURNING id, username, email, fullname, address`;
    values.push(id);

    const { rows } = await pool.query(query, values);
    return rows[0];
}

export async function softDeleteUser(id) {
    const query = `
        UPDATE users
        SET is_deleted = true,
            updated_at = NOW()
        WHERE id = $1
        RETURNING id, username, email, fullname, address, is_deleted
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
}

export async function permanentlyDeleteUsers() {
    const query = `
        DELETE FROM users
        WHERE is_deleted = true
        RETURNING id, username, email
    `;
    const { rows } = await pool.query(query);
    return rows;
}
