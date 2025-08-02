import { Request, Response } from "express";

import Product from "../models/Product";
import { IProduct } from "../type/productType";
import { uploadImage, deleteImage } from "../services/cloudinary";

// Multer ile gelen dosya için Request tipini genişlet
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const getAllProducts = async (req: Request, res: Response) => {
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

 

const createProduct = async (req: Request, res: Response) => {
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
      productCategory: Number(productCategory),
      productShortDescription,
      productDiscount: Number(productDiscount),
      isActive: isActive === "true",
      deliveryStatus: deliveryStatus === "true",
      productImage: {
        url: uploadedImageData.secure_url,
        publicId: uploadedImageData.public_id,
      },
    } as IProduct);

    // Veritabanına kaydet
    const savedProduct = await newProduct.save();

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

const deleteProduct = async (req: Request, res: Response) => {
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

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    let uploadedImageData = null;

    if (file) {
      // Önce resmi Cloudinary'e yükle
      try {
        uploadedImageData = await uploadImage(file.buffer);
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: "Resim yüklenirken hata oluştu",
          error: uploadError,
        });
      }
    }

    // Önce mevcut ürünü bul
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Ürün bulunamadı",
      });
    }

    // Mevcut ürün verilerini bir data nesnesine koy
    const updateData = {
      productName: existingProduct.productName,
      productDescription: existingProduct.productDescription,
      productPrice: existingProduct.productPrice,
      productCategory: existingProduct.productCategory,
      productShortDescription: existingProduct.productShortDescription,
      productDiscount: existingProduct.productDiscount,
      isActive: existingProduct.isActive,
      deliveryStatus: existingProduct.deliveryStatus,
      productImage: existingProduct.productImage,
    };
    
    // API'den gelen verilerle sadece değişen kısımları güncelle
    if (productName !== undefined && productName !== null && productName !== '') {
      updateData.productName = productName;
    }
    if (productDescription !== undefined && productDescription !== null && productDescription !== '') {
      updateData.productDescription = productDescription;
    }
    if (productPrice !== undefined && productPrice !== null && productPrice !== '') {
      updateData.productPrice = Number(productPrice);
    }
    if (productCategory !== undefined && productCategory !== null && productCategory !== '') {
      updateData.productCategory = Number(productCategory);
    }
    if (productShortDescription !== undefined && productShortDescription !== null && productShortDescription !== '') {
      updateData.productShortDescription = productShortDescription;
    }
    if (productDiscount !== undefined && productDiscount !== null && productDiscount !== '') {
      updateData.productDiscount = Number(productDiscount);
    }
    if (isActive !== undefined && isActive !== null && isActive !== '') {
      updateData.isActive = isActive === "true";
    }
    if (deliveryStatus !== undefined && deliveryStatus !== null && deliveryStatus !== '') {
      updateData.deliveryStatus = deliveryStatus === "true";
    }
    
    // Eğer yeni resim yüklendiyse resim bilgilerini güncelle
    if (uploadedImageData) {
      updateData.productImage = {
        url: uploadedImageData.secure_url,
        publicId: uploadedImageData.public_id,
      };
    }

    // Güncellenmiş data ile ürünü güncelle
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Ürün bulunamadı",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ürün başarıyla güncellendi!",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ürün güncellenirken hata oluştu",
    });
  }
};

 

export default {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};
