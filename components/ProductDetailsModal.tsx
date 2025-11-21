
import React, { useEffect, useState } from 'react';
import { Product, ProductInsights, Review } from '../types';
import { X, Star, Truck, ShieldCheck, Share2, Sparkles, Tag, CheckCircle, Heart, MessageCircle, Send, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { generateProductInsights } from '../services/geminiService';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, sourceRect?: DOMRect) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
  reviews?: Review[];
  onAddReview?: (productId: number, rating: number, comment: string) => void;
  onDelete?: (id: number) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
  reviews = [],
  onAddReview
}) => {
  const [insights, setInsights] = useState<ProductInsights | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');
  
  // Review Form State
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      setIsLoadingInsights(true);
      setInsights(null);
      // Set default active image
      setActiveImage(product.image);
      setNewReviewRating(0);
      setNewReviewComment('');
      
      generateProductInsights(product)
        .then(setInsights)
        .finally(() => setIsLoadingInsights(false));
    }
  }, [product, isOpen]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (product && onAddReview && newReviewRating > 0 && newReviewComment.trim()) {
      setIsSubmittingReview(true);
      // Simulate network delay for better UX feel
      setTimeout(() => {
        onAddReview(product.id, newReviewRating, newReviewComment);
        setNewReviewRating(0);
        setNewReviewComment('');
        setIsSubmittingReview(false);
      }, 600);
    }
  };

  if (!isOpen || !product) return null;

  const isSwap = product.listingType === 'swap';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)] border border-slate-200 dark:border-slate-800">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-full text-slate-900 dark:text-white backdrop-blur-md transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image Gallery Side - Enhanced with Ambient Background */}
        <div className="w-full md:w-1/2 bg-slate-100 dark:bg-slate-950 flex flex-col relative overflow-hidden group">
           {/* Ambient Background Blur */}
           <div 
             className="absolute inset-0 opacity-30 dark:opacity-20 blur-[60px] scale-125 transition-all duration-1000"
             style={{ backgroundImage: `url(${activeImage})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 via-transparent to-transparent dark:from-slate-900/50"></div>

          <div className="flex-1 relative flex items-center justify-center p-8 z-10">
             <img 
               id="active-product-image"
               src={activeImage} 
               alt={product.name} 
               className="w-full h-full object-contain max-h-[50vh] md:max-h-[600px] drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
             />
             
             {isSwap && (
               <div className="absolute top-6 left-6 bg-orange-500/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 border border-white/20">
                 <RefreshCw size={14} strokeWidth={3} className="animate-[spin_10s_linear_infinite]" />
                 SWAP ITEM
               </div>
             )}
          </div>
          
          {/* Thumbnails - Floating */}
          {product.images && product.images.length > 1 && (
            <div className="p-6 flex justify-center z-10">
              <div className="flex gap-3 p-2 bg-white/30 dark:bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-lg">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ease-out ${activeImage === img ? 'border-indigo-500 shadow-md scale-110 ring-2 ring-indigo-500/30' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Side */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto bg-white dark:bg-slate-900 custom-scrollbar z-10">
          <div className="mb-2 flex justify-between items-start">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-100 dark:border-indigo-500/20">{product.category}</span>
            {!isSwap && (
              <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold bg-yellow-50 dark:bg-yellow-900/10 px-2 py-1 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                <Star size={14} fill="currentColor" />
                {product.rating > 0 ? product.rating.toFixed(1) : 'New'}
                <span className="text-slate-400 font-normal ml-1 text-xs">({reviews.length})</span>
              </div>
            )}
          </div>

          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 leading-tight tracking-tight">{product.name}</h2>
          
          {/* Added By User Badge */}
          {product.addedBy && (
            <div className="flex items-center gap-3 mb-6 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl w-fit pr-4 border border-slate-100 dark:border-slate-700/50">
              <img src={product.addedBy.avatar} alt={product.addedBy.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-700" />
              <div className="flex flex-col">
                 <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Listed by</span>
                 <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                   {product.addedBy.name}
                   <CheckCircle size={12} className="text-blue-500" fill="currentColor" color="white" />
                 </span>
              </div>
            </div>
          )}

          {isSwap ? (
             <div className="mb-8 p-5 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 border border-orange-100 dark:border-orange-500/20 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <RefreshCw size={80} className="text-orange-500 rotate-12" />
               </div>
               <h3 className="text-sm font-bold text-orange-700 dark:text-orange-400 mb-2 uppercase tracking-wide flex items-center gap-2 relative z-10">
                 <RefreshCw size={16} /> Swap Request
               </h3>
               <p className="text-slate-800 dark:text-slate-100 font-medium text-lg relative z-10 leading-relaxed">
                 "{product.swapPreferences || "Open to all reasonable offers."}"
               </p>
             </div>
          ) : (
            <div className="flex items-baseline gap-2 mb-8">
               <span className="text-4xl font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
               <span className="text-sm text-slate-500 font-medium">USD</span>
            </div>
          )}

          {/* AI Insights Section */}
          <div className="mb-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-500/20 relative overflow-hidden group-hover:border-indigo-200 transition-colors">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-indigo-600 rounded-lg shadow-sm">
                 <Sparkles size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">AI Analysis</h3>
            </div>

            {isLoadingInsights ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-indigo-200/50 dark:bg-indigo-800/50 rounded-lg w-3/4"></div>
                <div className="h-4 bg-indigo-200/50 dark:bg-indigo-800/50 rounded-lg w-1/2"></div>
              </div>
            ) : insights ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {insights.vibeTags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-bold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full shadow-sm border border-indigo-100 dark:border-indigo-500/30">
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-indigo-900 dark:text-indigo-100 font-medium leading-relaxed italic">
                  "{insights.sellingPoint}"
                </p>
                <div className="flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-300 mt-2 pt-3 border-t border-indigo-200 dark:border-indigo-800/50">
                  <Tag size={12} />
                  <span className="font-semibold">Best for:</span> {insights.bestOccasion}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Analysis unavailable</p>
            )}
          </div>

          <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {!isSwap && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex flex-col gap-1 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <Truck size={24} className="text-indigo-600 dark:text-indigo-400 mb-1" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">Fast Delivery</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Free shipping over $100</span>
              </div>
              <div className="flex flex-col gap-1 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <ShieldCheck size={24} className="text-indigo-600 dark:text-indigo-400 mb-1" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">Guaranteed</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">2-year warranty included</span>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {!isSwap && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mb-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                Customer Reviews
                <span className="text-sm font-normal text-slate-400">({reviews.length})</span>
              </h3>

              {/* Write Review */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-6 border border-slate-100 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Write a review</h4>
                <form onSubmit={handleSubmitReview}>
                  <div className="flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="focus:outline-none transition-transform active:scale-90"
                      >
                        <Star 
                          size={24} 
                          className={`${newReviewRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} 
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <Button 
                      type="submit" 
                      size="sm"
                      disabled={newReviewRating === 0 || !newReviewComment.trim() || isSubmittingReview}
                    >
                      {isSubmittingReview ? <span className="animate-spin">⏳</span> : <Send size={14} />}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 dark:text-slate-500">
                    <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="flex gap-3 border-b border-slate-50 dark:border-slate-800/50 pb-4 last:border-0">
                      <img src={review.userAvatar} alt={review.userName} className="w-8 h-8 rounded-full bg-slate-200" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white">{review.userName}</h5>
                            <div className="flex items-center gap-1 mt-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={10} 
                                  className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300 dark:text-slate-600"} 
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="mt-auto flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900 z-20">
            <Button 
              className={`flex-1 py-4 text-lg font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-95 ${isSwap ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-orange-500/30' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/30'}`}
              onClick={(e) => {
                const img = document.getElementById('active-product-image');
                const rect = img?.getBoundingClientRect();
                onAddToCart(product, rect || e.currentTarget.getBoundingClientRect());
                onClose();
              }}
            >
              {isSwap ? (
                 <span className="flex items-center justify-center gap-2"><RefreshCw size={20} /> Request Swap</span>
              ) : (
                 <span className="flex items-center justify-center gap-2"><Truck size={20} /> Add to Cart</span>
              )}
            </Button>
            
            {onToggleWishlist && (
              <button 
                onClick={() => onToggleWishlist(product)}
                className={`w-14 flex items-center justify-center rounded-xl border-2 transition-all ${isWishlisted ? 'border-rose-200 bg-rose-50 text-rose-500 dark:bg-rose-900/20 dark:border-rose-800' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-rose-300 hover:text-rose-500'}`}
              >
                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} className="transition-transform active:scale-90" />
              </button>
            )}

            <button className="w-14 flex items-center justify-center rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-all">
              <Share2 size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
