
import React from 'react';
import { Product } from '../types';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (id: number) => void;
  onMoveToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onMoveToCart 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out] border-l border-slate-200 dark:border-slate-800">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="text-rose-500 fill-rose-500" size={24} />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Wishlist ({items.length})</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-400 dark:text-slate-500">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Heart size={32} className="text-slate-300 dark:text-slate-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-900 dark:text-white">Your wishlist is empty</p>
                <p className="text-sm mt-1">Save items you love to buy later.</p>
              </div>
              <Button variant="outline" onClick={onClose} className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="group flex gap-4 bg-white dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-100">
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1 text-sm mb-1">{item.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{item.category}</p>
                    <span className="font-bold text-slate-900 dark:text-white">${item.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => onMoveToCart(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <ShoppingCart size={12} />
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
