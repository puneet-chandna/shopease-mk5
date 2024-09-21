import { ObjectId } from 'mongodb'

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export const ProductCollection = 'products'