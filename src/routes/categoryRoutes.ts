import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import upload from '../middleware/upload'; // Upload middleware'ını import et

const router = express.Router();

// Tüm kategorileri getir
router.get('/', getAllCategories);

// ID'ye göre kategori getir
router.get('/:id', getCategoryById);

// Yeni kategori oluştur
router.post('/', upload.single('image'), createCategory);

// Kategoriyi güncelle
router.put('/:id', upload.single('image'), updateCategory);

// Kategoriyi sil
router.delete('/:id', deleteCategory);

export default router;
