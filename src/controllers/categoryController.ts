import { Request, Response } from 'express';
import Category, { ICategory } from '../models/Category';
import { uploadImage, deleteImage } from '../services/cloudinary';

// Tüm kategorileri getir
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories: ICategory[] = await Category.find();
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: 'Kategoriler getirilirken bir hata oluştu.', error });
  }
};

// ID'ye göre kategori getir
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category: ICategory | null = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }
    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ message: 'Kategori getirilirken bir hata oluştu.', error });
  }
};

// Kategoriyi güncelle
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category: ICategory | null = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }

    if (req.file) {
      // Eğer eski bir resim varsa, onu Cloudinary'den sil
      if (category.public_id) {
        await deleteImage(category.public_id);
      }
      const result = await uploadImage(req.file.buffer);
      category.imageUrl = result.secure_url;
      category.public_id = result.public_id;
    }

    category.name = name || category.name;
    category.description = description || category.description;

    const updatedCategory: ICategory = await category.save();
    res.json(updatedCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni kategori oluştur
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const newCategory: ICategory = new Category({ name, description });

    if (req.file) {
      const result = await uploadImage(req.file.buffer);
      newCategory.imageUrl = result.secure_url;
      newCategory.public_id = result.public_id;
    }

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Kategoriyi sil
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category: ICategory | null = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }

    // Eğer resim varsa, Cloudinary'den sil
    if (category.public_id) {
      await deleteImage(category.public_id);
    }

    await Category.findByIdAndDelete(id);
    res.json({ message: 'Kategori başarıyla silindi.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
