import mongoose, { Schema, Document } from 'mongoose';

// Kategori için arayüz
export interface ICategory extends Document {
  name: string;
  description: string;
  imageUrl?: string;
  public_id?: string;
}

// Kategori için Mongoose şeması
const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false, // Başlangıçta resim olmayabilir
    },
    public_id: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // Zaman damgalarını otomatik ekle
  }
);

export default mongoose.model<ICategory>('Category', CategorySchema);
