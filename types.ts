
export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  credits: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  type: 'ebook' | 'instrumental' | 'template' | 'formation';
  price: number;
  description: string;
  image: string;
  rating: number;
  sales: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  products: Product[];
  total: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
