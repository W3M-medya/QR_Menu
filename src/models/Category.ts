import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../type/categoryType';

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

export default mongoose.model<ICategory>('Category', CategorySchema);
