import { Request, Response } from "express";

import Product from "../models/Product";
import Category from "../models/Category";
import { IProduct } from "../type/productType";
import { uploadImage, deleteImage } from "../services/cloudinary";

// Multer ile gelen dosya için Request tipini genişlet
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ürünler getirilemedi.",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      productName,
      productDescription,
      productPrice,
      productCategory,
      productShortDescription,
      productDiscount,
      isActive,
      deliveryStatus,
    } = req.body;

    // Dosya kontrolü
    const file = (req as any).file as Express.Multer.File;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Ürün resmi gereklidir",
      });
    }

    // Önce resmi Cloudinary'e yükle
    let uploadedImageData = null;
    try {
      uploadedImageData = await uploadImage(file.buffer);
    } catch (uploadError) {
      return res.status(400).json({
        success: false,
        message: "Resim yüklenirken hata oluştu",
        error: uploadError,
      });
    }

    // Yeni ürün oluştur - Cloudinary'den gelen verilerle
    const newProduct = new Product({
      productName,
      productDescription,
      productPrice: Number(productPrice),
      categoryId: req.body.categoryId,
      productShortDescription,
      productDiscount: Number(productDiscount),
      isActive: isActive === "true",
      deliveryStatus: deliveryStatus === "true",
      productImage: {
        url: uploadedImageData.secure_url,
        publicId: uploadedImageData.public_id,
      },
    });

    // Veritabanına kaydet
        const savedProduct = await newProduct.save();

    // Add product to category
    if (savedProduct.categoryId) {
      await Category.findByIdAndUpdate(savedProduct.categoryId, {
        $push: { products: savedProduct._id },
      });
    }

    res.status(201).json({
      success: true,
      message: "Ürün başarıyla oluşturuldu!",
      data: savedProduct,
    });
  } catch (error: any) {
    console.error(error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validasyon hatası",
        errors: error.errors,
      });
    }

    // Unique constraint error
    if (error.code === 11000) {
      let duplicateField = "alan";
      let duplicateValue = "değer";

      if (error.keyPattern && error.keyValue) {
        duplicateField = Object.keys(error.keyPattern)[0] || "alan";
        duplicateValue = error.keyValue[duplicateField] || "değer";
      }

      return res.status(400).json({
        success: false,
        message: `Bu ${
          duplicateField === "productName" ? "ürün adı" : duplicateField
        } zaten kullanılıyor: "${duplicateValue}"`,
        field: duplicateField,
        value: duplicateValue,
      });
    }

    res.status(500).json({
      success: false,
      message: "Ürün oluşturulurken hata oluştu",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Ürün bulunamadı",
      });
    }
    // Cloudinary'den resmi sil
    await deleteImage(product.productImage.publicId);
    // Veritabanından ürünü sil
        // Remove product from category
    if (product.categoryId) {
      await Category.findByIdAndUpdate(product.categoryId, {
        $pull: { products: product._id },
      });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Ürün başarıyla silindi",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ürün silinirken hata oluştu",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const file = (req as any).file as Express.Multer.File;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Ürün bulunamadı" });
    }

    const oldCategoryId = existingProduct.categoryId;

    const updateData: any = { ...body };

    if (file) {
      try {
        const uploadedImageData = await uploadImage(file.buffer);
        updateData.productImage = {
          url: uploadedImageData.secure_url,
          publicId: uploadedImageData.public_id,
        };
        // Eski resmi sil
        if (existingProduct.productImage && existingProduct.productImage.publicId) {
          await deleteImage(existingProduct.productImage.publicId);
        }
      } catch (err) {
        return res.status(400).json({ success: false, message: "Resim yüklenirken hata oluştu", error: err });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Ürün güncellenemedi" });
    }

    const newCategoryId = updatedProduct.categoryId;

    if (String(oldCategoryId) !== String(newCategoryId)) {
      if (oldCategoryId) {
        await Category.findByIdAndUpdate(oldCategoryId, { $pull: { products: existingProduct._id } });
      }
      if (newCategoryId) {
        await Category.findByIdAndUpdate(newCategoryId, { $push: { products: updatedProduct._id } });
      }
    }

    res.status(200).json({
      success: true,
      message: "Ürün başarıyla güncellendi!",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Ürün güncellenirken hata oluştu" });
  }
};


