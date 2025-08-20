import { Request, Response } from "express";
import Category from "../models/Category";
import Product from "../models/Product";
import { ICategory } from "../type/categoryType";
import { uploadImage, deleteImage } from "../services/cloudinary";
import Counter from "../models/Counter";

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().populate("products");
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "products"
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  const { categoryName, categoryDescription, categoryShortDescription } =
    req.body;
  const file = (req as any).file as Express.Multer.File;
  if (!file) {
    return res.status(400).json({
      success: false,
      message: "Ürün resmi gereklidir",
    });
  }
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

  // Otomatik artan productCode al
  let categoryCode = 0;
  const counter = await Counter.findOneAndUpdate(
    { name: "categoryCode" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  categoryCode = counter.seq;
  if (categoryCode > 9999) {
    return res.status(400).json({
      success: false,
      message: "Maksimum kategori kodu sınırına ulaşıldı.",
    });
  }

  // Yeni kategori oluştur
  const newCategory = new Category({
    categoryName,
    categoryDescription: categoryDescription || "",
    categoryShortDescription: categoryShortDescription || "",
    categoryImage: uploadedImageData?.secure_url,
    categoryCode,
    isActive: true,
  });

  try {
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Remove category reference from all products in this category
    await Product.updateMany(
      { categoryId: categoryId },
      { $unset: { categoryId: 1 } } // or $set: { categoryId: null }
    );

    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
