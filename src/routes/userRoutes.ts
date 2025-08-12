import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getAdminProfile, 
  adminRegisterUser, 
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus
} from '../controllers/userController';
import multer from 'multer';

const upload = multer();

const router = express.Router();

// Genel kullanıcı işlemleri
router.get('/', getAllUsers);                                    // Tüm kullanıcıları listele (ana rota)
router.post('/register', registerUser);
router.post('/login', upload.none(), loginUser);
router.get('/profile', getAdminProfile);

// Admin işlemleri - Kullanıcı Yönetimi
router.post('/admin/register', upload.none(), adminRegisterUser);  // Yeni kullanıcı oluştur
router.get('/admin/users', getAllUsers);                           // Tüm kullanıcıları listele
router.get('/admin/users/:id', getUserById);                       // Tek kullanıcı getir
router.put('/admin/users/:id', upload.none(), updateUser);         // Kullanıcı güncelle
router.delete('/admin/users/:id', deleteUser);                     // Kullanıcı sil
router.patch('/admin/users/:id/toggle-status', toggleUserStatus);  // Kullanıcı durumu değiştir

export default router;