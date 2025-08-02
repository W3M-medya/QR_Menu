import mongoose, { Schema, Document } from 'mongoose';
import {IProduct} from '../type/productType';
 
const ProductSchema: Schema = new Schema({
  productName: {
    type: String,
    required: true,
    unique: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productCategory: {
    type: Number,
    required: true,
  },
  productShortDescription: {
    type: String,
    required: true,
  },
  productDiscount: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  deliveryStatus: {
    type: Boolean,
    default: false,
  },
  productImage: {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
});


export default mongoose.model<IProduct>('Product', ProductSchema);