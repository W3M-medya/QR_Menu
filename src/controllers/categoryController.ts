import { Request, Response } from 'express';
import Category from '../models/Category';
import Product from '../models/Product';
import { ICategory } from '../type/categoryType';

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().populate('products');
    res.status(200).json(categories);
  } catch (error: any) { 
    res.status(500).json({ message: error.message });
  }
};

// Get a single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id).populate('products');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error: any) { 
    res.status(500).json({ message: error.message });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
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
      return res.status(404).json({ message: 'Category not found' });
    }

    // Remove category reference from all products in this category
    await Product.updateMany(
      { categoryId: categoryId },
      { $unset: { categoryId: 1 } } // or $set: { categoryId: null }
    );

    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
