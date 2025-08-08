import express from 'express';
import { registerUser, loginUser, getAdminProfile } from '../controllers/userController';
 
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile',  getAdminProfile);

export default router;