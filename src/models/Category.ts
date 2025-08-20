import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../type/categoryType';

const CategorySchema: Schema = new Schema({
  categoryName: {
    type: String,
    required: true,
    unique: false,
  },
  categoryImage: {
    type: String,
    required: true,
  },
  categoryDescription: {
    type: String,
    required: false,
  },
  categoryShortDescription: {
    type: String,
    required: false,
  },
  categoryCode: {
    type: Number,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

export default mongoose.model<ICategory>('Category', CategorySchema);
