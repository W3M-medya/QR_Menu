import express from 'express';
import { registerUser, loginUser, getAdminProfile } from '../controllers/userController';
import multer from 'multer';

const upload = multer();


const router = express.Router();

router.post('/register', registerUser);

router.post('/login', upload.none(), loginUser);

router.get('/profile', getAdminProfile);

export default router;