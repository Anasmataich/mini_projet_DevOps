export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  rating: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 79.99,
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    stock: 15,
    rating: 4.5
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    stock: 8,
    rating: 4.8
  },
  {
    id: '3',
    name: 'Laptop Backpack',
    price: 49.99,
    description: 'Durable laptop backpack with multiple compartments and USB charging port',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    stock: 25,
    rating: 4.3
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    price: 129.99,
    description: 'RGB mechanical gaming keyboard with customizable keys',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop',
    stock: 12,
    rating: 4.7
  },
  {
    id: '5',
    name: 'Wireless Mouse',
    price: 39.99,
    description: 'Ergonomic wireless mouse with precision tracking',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
    stock: 30,
    rating: 4.4
  },
  {
    id: '6',
    name: 'Phone Case',
    price: 19.99,
    description: 'Protective phone case with shock absorption',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop',
    stock: 50,
    rating: 4.2
  },
  {
    id: '7',
    name: 'USB-C Hub',
    price: 59.99,
    description: 'Multi-port USB-C hub with HDMI and card reader',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop',
    stock: 20,
    rating: 4.6
  },
  {
    id: '8',
    name: 'Desk Lamp',
    price: 34.99,
    description: 'LED desk lamp with adjustable brightness and color temperature',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop',
    stock: 18,
    rating: 4.5
  },
  {
    id: '9',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    price: 59.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80',
    stock: 92,
    rating: 4.4
  },
  {
    id: '10',
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
    price: 79.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&q=80',
    stock: 64,
    rating: 4.5
  },
  {
    id: '11',
    name: 'Portable Charger',
    description: '20000mAh power bank with fast charging',
    price: 39.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80',
    stock: 125,
    rating: 4.2
  },
  {
    id: '12',
    name: 'Webcam HD',
    description: '1080p webcam with built-in microphone',
    price: 89.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500&q=80',
    stock: 41,
    rating: 4.4
  }
];



export const categories = ['All', 'Electronics', 'Accessories', 'Home'];