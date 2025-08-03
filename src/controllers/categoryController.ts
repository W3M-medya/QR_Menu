import { Request, Response } from 'express';
import Category from '../models/Category';

// Tüm kategorileri getir
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Kategoriler getirilirken bir hata oluştu.', error });
  }
};

// ID'ye göre kategori getir
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Kategori getirilirken bir hata oluştu.', error });
  }
};

// Yeni kategori oluştur
export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Kategori oluşturulurken bir hata oluştu.', error });
  }
};

// Kategoriyi sil
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }
    res.status(200).json({ message: 'Kategori başarıyla silindi.' });
  } catch (error) {
    res.status(500).json({ message: 'Kategori silinirken bir hata oluştu.', error });
  }
};
