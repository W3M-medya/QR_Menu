export interface IProduct {
  id: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productCategory: number;
  productShortDescription: string;
  productDiscount: number;
  isActive: boolean;
  deliveryStatus: boolean;
  productImage: {
    url: string;
    publicId: string;
  };
}
