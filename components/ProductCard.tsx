import React from 'react';
import { Product } from '../types';
import { Plus, Star, Heart, ShoppingBag, ArrowLeftRight, RefreshCw, Share2 } from 'lucide-react';
import { Button } from './Button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, sourceRect?: DOMRect) => void;
  onClick: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onRequestSwap?: (product: Product) => void;
  isInCompare?: boolean;
  onToggleCompare?: (product: Product) => void;
  onShare?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onClick,
  isWishlisted = false,
  onToggleWishlist,
  onBuyNow,
  onRequestSwap,
  isInCompare = false,
  onToggleCompare,
  onShare
}) => {
  const isSwap = product.listingType === 'swap';

  return (
    <div 
      className={`group relative rounded-2xl overflow-hidden hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 cubic-bezier(0.25, 0.8, 0.25, 1) cursor-pointer border 
        ${isSwap 
          ? 'bg-gradient-to-b from-white to-orange-50 dark:from-slate-900 dark:to-orange-900/10 border-orange-200 dark:border-orange-500/30 hover:border-orange-400 dark:hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/20' 
          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/20'
        }`}
      onClick={() => onClick(product)}
    >
      {/* Image Container - Changed to Aspect Square for modern look */}
      <div className="relative w-full aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        
        {/* Enhanced Overlay */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isSwap ? 'bg-gradient-to-t from-orange-900/30 via-transparent to-transparent' : 'bg-gradient-to-t from-slate-900/30 via-transparent to-transparent'}`}></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {isSwap ? (
            <div className="bg-orange-500/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-sm border border-white/10">
              <RefreshCw size={12} strokeWidth={2.5} className="animate-[spin_10s_linear_infinite]" />
              SWAP
            </div>
          ) : (
            <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
              <Star size={10} className="text-yellow-500 fill-yellow-500" />
              {product.rating}
            </div>
          )}
        </div>

        {/* Action Buttons Stack (Top Right) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {/* Wishlist Button */}
          {onToggleWishlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 shadow-sm
                ${isWishlisted 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white/90 dark:bg-slate-900/90 text-slate-500 hover:text-rose-500 dark:text-slate-400'
                }
                opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 delay-0
              `}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          )}

          {/* Compare Button */}
          {onToggleCompare && !isSwap && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(product);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 shadow-sm
                ${isInCompare 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white/90 dark:bg-slate-900/90 text-slate-500 hover:text-indigo-600 dark:text-slate-400'
                }
                opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 delay-75
              `}
              title={isInCompare ? "Remove from Compare" : "Add to Compare"}
            >
              <ArrowLeftRight size={18} />
            </button>
          )}
          
          {/* Share Button */}
           {onShare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(product);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 shadow-sm
                bg-white/90 dark:bg-slate-900/90 text-slate-500 hover:text-sky-500 dark:text-slate-400
                opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 delay-100
              `}
              title="Share Product"
            >
              <Share2 size={18} />
            </button>
          )}
        </div>

        {/* Buy Now Button (Bottom Left) */}
        {onBuyNow && !isSwap && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow(product);
            }}
            className="absolute bottom-3 left-3 px-4 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white rounded-full flex items-center gap-2 shadow-lg translate-y-16 group-hover:translate-y-0 transition-all duration-300 delay-75 z-10 font-bold border border-indigo-100 dark:border-indigo-900"
          >
            <ShoppingBag size={16} />
            <span className="text-xs">Buy Now</span>
          </button>
        )}

        {/* Request Swap Button (Bottom Left) */}
        {isSwap && onRequestSwap && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRequestSwap(product);
            }}
            className="absolute bottom-3 left-3 px-4 h-10 bg-orange-500 text-white rounded-full flex items-center gap-2 shadow-lg translate-y-16 group-hover:translate-y-0 transition-transform duration-300 delay-75 hover:bg-orange-600 z-10"
          >
            <RefreshCw size={16} />
            <span className="text-xs font-bold">Request</span>
          </button>
        )}

        {/* Add/Request Button (Floating) */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            const card = e.currentTarget.closest('.group');
            const img = card?.querySelector('img');
            const rect = img?.getBoundingClientRect();
            onAddToCart(product, rect);
          }}
          className={`absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center shadow-lg translate-y-16 group-hover:translate-y-0 transition-transform duration-300 cubic-bezier(0.2, 0.8, 0.2, 1)
            ${isSwap 
              ? 'bg-white text-orange-600 hover:bg-orange-600 hover:text-white shadow-orange-500/20' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30'
            }
          `}
          title={isSwap ? "Request Swap" : "Add to Cart"}
        >
          {isSwap ? <RefreshCw size={20} /> : <Plus size={24} />}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 relative">
        {/* Background Icon for Swap (Subtle Watermark) */}
        {isSwap && (
          <RefreshCw className="absolute right-2 bottom-2 text-orange-500/5 rotate-12 pointer-events-none" size={80} />
        )}

        <div className="flex justify-between items-start mb-1">
           <div className="w-full">
             <h3 className={`font-medium text-base leading-snug line-clamp-1 transition-colors ${isSwap ? 'text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400' : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
              {product.name}
            </h3>
            {product.addedBy?.email && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate w-full">
                {product.addedBy.email}
              </p>
            )}
           </div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <p className="text-xs text-slate-500 dark:text-slate-400">{product.category}</p>
          {isSwap ? (
             <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-md">Trade</span>
          ) : (
             <span className="text-slate-900 dark:text-white font-bold">${product.price