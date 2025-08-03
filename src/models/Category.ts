import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  categoryName: string;
  categoryTag: string;
  categoryDesc: string;
  productN: string; // Bu alanın tam olarak ne olduğunu bilmediğim için string olarak tanımlıyorum.
}

const CategorySchema: Schema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    categoryTag: {
      type: String,
      required: true,
    },
    categoryDesc: {
      type: String,
      required: true,
    },
    productN: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', CategorySchema);
