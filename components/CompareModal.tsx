
import React from 'react';
import { Product } from '../types';
import { X, Star, ShoppingBag, Trash2, ArrowLeftRight } from 'lucide-react';
import { Button } from './Button';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onRemove: (id: number) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
  onRemove
}) => {
  if (!isOpen) return null;

  if (products.length === 0) return null;

  // Determine best values for highlighting
  const minPrice = Math.min(...products.map(p => p.price));
  const maxRating = Math.max(...products.map(p => p.rating));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-[scaleIn_0.2s_ease-out] border border-slate-200 dark:border-slate-800">
        
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
             <ArrowLeftRight className="text-indigo-500" size={24} />
             Compare Products
             <span className="ml-2 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
               {products.length} / 4
             </span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-auto custom-scrollbar flex-1 p-6">
          <div className="min-w-[800px]">
            <div className="grid" style={{ gridTemplateColumns: `200px repeat(${products.length}, minmax(200px, 1fr))` }}>
              
              {/* Header Row - Product Info */}
              <div className="p-4 font-bold text-slate-500 dark:text-slate-400 flex items-center">Product</div>
              {products.map(product => (
                <div key={product.id} className="p-4 flex flex-col items-center text-center border-l border-slate-100 dark:border-slate-800 relative group">
                  <button 
                    onClick={() => onRemove(product.id)}
                    className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove from comparison"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="w-32 h-32 mb-4 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 px-2 text-sm">{product.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{product.category}</p>
                </div>
              ))}

              {/* Price Row */}
              <div className="p-4 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 flex items-center">Price</div>
              {products.map(product => (
                <div key={product.id} className={`p-4 text-center font-bold border-l border-slate-100 dark:border-slate-800 flex items-center justify-center flex-col bg-slate-50 dark:bg-slate-800/50 ${product.price === minPrice ? 'text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-900/10' : 'text-slate-900 dark:text-white'}`}>
                  <span className="text-lg">${product.price.toFixed(2)}</span>
                  {product.price === minPrice && products.length > 1 && <span className="mt-1 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded uppercase tracking-wide font-bold">Best Price</span>}
                </div>
              ))}

              {/* Rating Row */}
              <div className="p-4 font-semibold text-slate-700 dark:text-slate-300 flex items-center">Rating</div>
              {products.map(product => (
                <div key={product.id} className="p-4 flex justify-center border-l border-slate-100 dark:border-slate-800">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${product.rating === maxRating && products.length > 1 ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' : ''}`}>
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className={`font-bold ${product.rating === maxRating && products.length > 1 ? 'text-yellow-700 dark:text-yellow-400' : 'text-slate-700 dark:text-slate-300'}`}>{product.rating}</span>
                  </div>
                </div>
              ))}

              {/* Description Row */}
              <div className="p-4 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 flex items-center">Description</div>
              {products.map(product => (
                <div key={product.id} className="p-4 text-sm text-slate-600 dark:text-slate-400 border-l border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 leading-relaxed text-center">
                  {product.description}
                </div>
              ))}
              
              {/* Action Row */}
              <div className="p-4 font-semibold text-slate-700 dark:text-slate-300 flex items-center">Action</div>
              {products.map(product => (
                <div key={product.id} className="p-4 flex justify-center border-l border-slate-100 dark:border-slate-800">
                  <Button 
                     onClick={() => onAddToCart(product)}
                     className="w-full max-w-[140px] shadow-sm text-xs"
                     size="sm"
                  >
                    <ShoppingBag size={14} className="mr-2" />
                    Add to Cart
                  </Button>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
