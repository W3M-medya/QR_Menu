import express from 'express';
import { registerUser, loginUser, getAdminProfile } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', protect, getAdminProfile);

export default router;