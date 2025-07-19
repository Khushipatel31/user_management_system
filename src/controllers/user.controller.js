import { registerUser } from '../use-cases/register-user.usecase.js';
import { loginUser } from '../use-cases/login-user.usecase.js';
import { listUsers } from '../use-cases/list-users.usecase.js';
import { deleteUserProfile } from '../use-cases/delete-user.usecase.js';


export async function handleUserRegistration(req, res) {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}


export async function handleUserLogin(req, res) {
    try {
        const sessionId = await loginUser(req.body);

        res.cookie('session_id', sessionId, {
            httpOnly: true,
            maxAge: 3600 * 1000, // 1 hour
        });

        res.json({ success: true, session_id: sessionId });
    } catch (err) {
        res.status(401).json({ success: false, message: err.message });
    }
}


export async function handleListUsers(req, res) {
    try {
        const users = await listUsers(req.query);
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

import { updateUserProfile } from '../use-cases/update-user.usecase.js';

export async function handleUpdateUser(req, res) {
    try {
        const updatedUser = await updateUserProfile({
            id: req.params.id,
            userId: req.user.id,
            ...req.body,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found or deleted.' });
        }

        res.json({ success: true, user: updatedUser });
    } catch (err) {
        res.status(403).json({ success: false, message: err.message });
    }
}


export async function handleDeleteUser(req, res) {
    try {
        const deletedUser = await deleteUserProfile({
            id: req.params.id,
            userId: req.user.id,
        });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found or already deleted.' });
        }

        res.json({ success: true, user: deletedUser });
    } catch (err) {
        res.status(403).json({ success: false, message: err.message });
    }
}