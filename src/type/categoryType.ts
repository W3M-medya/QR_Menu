import { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  products: Schema.Types.ObjectId[];
}
