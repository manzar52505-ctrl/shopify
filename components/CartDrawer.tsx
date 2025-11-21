
import React from 'react';
import { CartItem } from '../types';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from './Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
            <ShoppingBag className="text-indigo-600 dark:text-indigo-400" size={24} />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Cart ({items.length})</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-400 dark:text-slate-500">
              <ShoppingBag size={64} strokeWidth={1} />
              <p className="text-lg font-medium">Your cart is empty</p>
              <Button variant="outline" onClick={onClose} className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Start Shopping</Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-white" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center text-slate-900 dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">${total.toFixed(2)}</span>
            </div>
            <Button 
              onClick={onCheckout}
              className="w-full py-6 text-lg shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              Checkout Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};