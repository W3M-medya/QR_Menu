import express from 'express';
import { getAllProducts, createProduct, deleteProduct, updateProduct } from '../controllers/productController';
import upload from '../middleware/upload';

const router = express.Router();

// Tüm ürünleri getir
router.get('/', getAllProducts);

 
 
// Yeni ürün oluştur - Multer middleware ile
router.post('/', upload.single('productImage'), createProduct);

router.delete('/:id', deleteProduct);

router.put('/:id', upload.single('productImage'), updateProduct);

export default router;


 