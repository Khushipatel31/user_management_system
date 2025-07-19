import express from 'express';
import { handleUserRegistration } from '../controllers/user.controller.js';
import { handleUserLogin } from '../controllers/user.controller.js';
import { sessionAuth } from '../middlewares/auth.middleware.js';
import { handleListUsers } from '../controllers/user.controller.js';
import { handleUpdateUser } from '../controllers/user.controller.js';
import { handleDeleteUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', handleUserRegistration);
router.post('/login', handleUserLogin);
router.get('/', sessionAuth, handleListUsers);
router.put('/:id', sessionAuth, handleUpdateUser);
router.delete('/:id', sessionAuth, handleDeleteUser);


export default router;
