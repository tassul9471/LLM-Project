import { JsonCollection, BaseDoc } from '../utils/storage.js';

export interface IProduct extends BaseDoc {
  userId: string;
  name: string;
  category: string;
  description: string;
  features: string;
  benefits: string;
  audience: string;
  price?: string | number;
  offer?: string;
}

export const ProductModel = new JsonCollection<IProduct>('products');
