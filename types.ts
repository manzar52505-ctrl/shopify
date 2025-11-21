
export interface Product {
  id: number;
  name: string;
  price: number; // If 0 or undefined, treated as purely for swap
  category: string;
  description: string;
  image: string; // Primary thumbnail
  images: string[]; // Gallery
  rating: number;
  listingType: 'sale' | 'swap';
  swapPreferences?: string; // What the user wants in return
  addedBy?: {
    name: string;
    avatar: string;
    email: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 string for user uploads
  isThinking?: boolean;
  suggestedProductIds?: number[];
}

export interface ProductInsights {
  vibeTags: string[];
  sellingPoint: string;
  bestOccasion: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
}

export interface Review {
  id: string;
  productId: number;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Purchase {
  id: string;
  userEmail: string;
  date: string;
  items: CartItem[];
  total: number;
}

export interface Notification {
  id: string;
  userId: string; // Recipient email
  type: 'swap_proposal' | 'system';
  title: string;
  message: string;
  read: boolean;
  date: string;
  data?: any; // Flexible data for swap details
}

export enum ViewState {
  SHOP = 'SHOP',
  CART = 'CART',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
}
