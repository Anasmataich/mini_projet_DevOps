// src/types.ts
export interface Product {
  id: number;        // int
  name: string;
  description: string;
  price: number;     // decimal -> number
  image: string;
  category: string;
  stock: number;
  rating: number;    // decimal -> number
}
