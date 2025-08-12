import { Document, Schema } from 'mongoose';

export interface IProduct extends Document {

  productName: string;
  productDescription: string;
  productPrice: number;
  categoryId?: Schema.Types.ObjectId;
  productShortDescription: string;
  productDiscount: number;
  isActive: boolean;
  deliveryStatus: boolean;
  productImage: {
    url: string;
    publicId: string;
  };
}
