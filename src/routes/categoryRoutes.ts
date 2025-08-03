import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
} from '../controllers/categoryController';

const router = express.Router();

// Tüm kategorileri getir
router.get('/', getAllCategories);

// ID'ye göre kategori getir
router.get('/:id', getCategoryById);

// Yeni kategori oluştur
router.post('/', createCategory);

// Kategoriyi sil
router.delete('/:id', deleteCategory);

export default router;
