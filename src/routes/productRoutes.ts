import express from 'express';
import productController from '../controllers/productController';
import upload from '../middleware/upload';

const router = express.Router();

// Tüm ürünleri getir
router.get('/', productController.getAllProducts);

 
 
// Yeni ürün oluştur - Multer middleware ile
router.post('/', upload.single('productImage'), productController.createProduct);

router.delete('/:id', productController.deleteProduct);

export default router;


 