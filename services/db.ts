
import { Product, User, Purchase, Notification, Review } from '../types';
import { MOCK_PRODUCTS } from '../constants';

// Keys for LocalStorage
const KEYS = {
  PRODUCTS: 'swapify_db_products',
  USERS: 'swapify_db_users',
  PURCHASES: 'swapify_db_purchases',
  NOTIFICATIONS: 'swapify_db_notifications',
  REVIEWS: 'swapify_db_reviews',
  WISHLIST: 'swapify_db_wishlist'
};

class DatabaseService {
  // Products
  getProducts(): Product[] {
    const stored = localStorage.getItem(KEYS.PRODUCTS);
    if (!stored) {
      // Initialize with mock data if empty
      this.saveProducts(MOCK_PRODUCTS);
      return MOCK_PRODUCTS;
    }
    return JSON.parse(stored);
  }

  saveProducts(products: Product[]) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  }

  addProduct(product: Product) {
    const products = this.getProducts();
    products.unshift(product);
    this.saveProducts(products);
    return products;
  }

  updateProduct(updatedProduct: Product) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      this.saveProducts(products);
    }
    return products;
  }

  deleteProduct(id: number) {
    const products = this.getProducts();
    const newProducts = products.filter(p => p.id !== id);
    this.saveProducts(newProducts);
    return newProducts;
  }

  // Users
  getUsers(): Record<string, User & { password?: string }> {
    const stored = localStorage.getItem(KEYS.USERS);
    return stored ? JSON.parse(stored) : {};
  }

  saveUser(user: User & { password?: string }) {
    const users = this.getUsers();
    users[user.email.toLowerCase()] = user;
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }

  getUser(email: string): (User & { password?: string }) | null {
    const users = this.getUsers();
    return users[email.toLowerCase()] || null;
  }

  // Purchases (Orders)
  getPurchases(): Purchase[] {
    const stored = localStorage.getItem(KEYS.PURCHASES);
    return stored ? JSON.parse(stored) : [];
  }

  addPurchase(purchase: Purchase) {
    const purchases = this.getPurchases();
    purchases.unshift(purchase);
    localStorage.setItem(KEYS.PURCHASES, JSON.stringify(purchases));
    return purchases;
  }

  // Notifications
  getNotifications(): Notification[] {
    const stored = localStorage.getItem(KEYS.NOTIFICATIONS);
    return stored ? JSON.parse(stored) : [];
  }

  addNotification(notification: Notification) {
    const list = this.getNotifications();
    list.unshift(notification);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
    return list;
  }

  markNotificationsRead(userEmail: string) {
    const list = this.getNotifications();
    const updated = list.map(n => n.userId === userEmail ? { ...n, read: true } : n);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  }

  // Reviews
  getReviews(): Review[] {
    const stored = localStorage.getItem(KEYS.REVIEWS);
    if (!stored) {
      // Default mock reviews
      const defaults = [
        { id: '1', productId: 1, userName: 'Alice M.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', rating: 5, comment: 'Absolutely love the fit of this jacket! High quality leather.', date: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: '2', productId: 1, userName: 'John D.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', rating: 4, comment: 'Great style, but runs slightly small.', date: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: '3', productId: 2, userName: 'Sarah K.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', rating: 5, comment: 'Best headphones I have ever owned. The noise cancellation is magic.', date: new Date(Date.now() - 86400000 * 10).toISOString() }
      ];
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(stored);
  }

  addReview(review: Review) {
    const reviews = this.getReviews();
    reviews.unshift(review);
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
    return reviews;
  }

  // Reset DB (Admin utility)
  reset() {
    localStorage.clear();
    window.location.reload();
  }
}

export const db = new DatabaseService();
