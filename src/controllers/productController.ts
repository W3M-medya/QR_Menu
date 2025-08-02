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

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = (req as any).file as Express.Multer.File;

    // Ürün var mı?
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Ürün bulunamadı" });
    }

    // Resim yükleme
    let uploadedImageData = null;
    if (file) {
      try {
        uploadedImageData = await uploadImage(file.buffer);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Resim yüklenirken hata oluştu",
          error: err,
        });
      }
    }

    // Güncellenecek alanları hazırla
    const fieldsToUpdate = [
      "productName",
      "productDescription",
      "productPrice",
      "productCategory",
      "productShortDescription",
      "productDiscount",
      "isActive",
      "deliveryStatus",
    ];

    const updateData: any = {};

    fieldsToUpdate.forEach((field) => {
      const value = req.body[field];
      if (value !== undefined && value !== null && value !== "") {
        if (
          ["productPrice", "productCategory", "productDiscount"].includes(field)
        ) {
          updateData[field] = Number(value);
        } else if (["isActive", "deliveryStatus"].includes(field)) {
          updateData[field] = value === "true";
        } else {
          updateData[field] = value;
        }
      }
    });

    // Yeni resim varsa, güncelle
    if (uploadedImageData) {
      updateData.productImage = {
        url: uploadedImageData.secure_url,
        publicId: uploadedImageData.public_id,
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

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
