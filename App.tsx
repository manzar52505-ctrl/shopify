
import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AIChatAssistant } from './components/AIChatAssistant';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { AuthModal } from './components/AuthModal';
import { AddProductModal } from './components/AddProductModal';
import { ProfileModal } from './components/ProfileModal';
import { CompareModal } from './components/CompareModal';
import { SwapProposalModal } from './components/SwapProposalModal';
import { PaymentModal } from './components/PaymentModal';
import { OrderConfirmation } from './components/OrderConfirmation';
import { AdminDashboard } from './components/AdminDashboard';
import { Product, CartItem, User, Review, Purchase, Notification } from './types';
import { searchProductsWithAI } from './services/geminiService';
import { db } from './services/db';
import { Loader2, XCircle, ArrowRight, Sparkles, Github, Twitter, Instagram, MessageSquare, ListFilter, Search, Star, Check, AlertCircle, ShoppingBag, RefreshCw } from 'lucide-react';
import { Button } from './components/Button';

// Helper Component for Flying Animation
const FlyingItem: React.FC<{ src: string, start: DOMRect, end: DOMRect, onComplete: () => void }> = ({ src, start, end, onComplete }) => {
  const [style, setStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: start.top,
    left: start.left,
    width: start.width,
    height: start.height,
    zIndex: 100,
    pointerEvents: 'none',
    transition: 'all 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
    opacity: 1,
    borderRadius: '0.75rem',
    objectFit: 'cover',
  });

  useEffect(() => {
    // Trigger animation in next frame to ensure initial state is rendered
    requestAnimationFrame(() => {
      setStyle(prev => ({
        ...prev,
        top: end.top + end.height / 2 - 16, // Center relative to cart icon
        left: end.left + end.width / 2 - 16,
        width: 32,
        height: 32,
        opacity: 0, // Fade out at the very end
        borderRadius: '50%',
        transform: 'scale(0.5)' // Shrink effect
      }));
    });

    const timer = setTimeout(onComplete, 800); // Match transition duration
    return () => clearTimeout(timer);
  }, [end, onComplete]);

  return <img src={src} alt="" style={style} className="shadow-xl shadow-indigo-500/30 border-2 border-white dark:border-slate-800 z-[100]" />;
};

// Toast Notification Component
const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className="fixed top-24 right-4 md:right-8 z-[100] flex items-center gap-3 px-6 py-3.5 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 backdrop-blur-md rounded-full shadow-2xl shadow-indigo-500/20 animate-[slideLeft_0.4s_cubic-bezier(0.16,1,0.3,1)] cursor-pointer hover:scale-105 transition-transform border border-white/10 dark:border-slate-200/50" 
      onClick={onClose}
    >
      <div className="bg-indigo-500 rounded-full p-1 shadow-lg shadow-indigo-500/30">
        {message.includes("compare") ? (
           <AlertCircle size={14} className="text-white" strokeWidth={3} />
        ) : (
           <Check size={14} className="text-white" strokeWidth={3} />
        )}
      </div>
      <span className="font-medium text-sm pr-1">{message}</span>
    </div>
  );
};

interface FilterProps {
  value: string | number;
  onChange: (value: any) => void;
}

const SortSelect: React.FC<FilterProps> = ({ value, onChange }) => (
  <div className="relative min-w-[180px]">
    <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer hover:border-indigo-300 dark:hover:border-slate-600 transition-colors shadow-sm"
    >
      <option value="featured">Sort by: Featured</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating">Top Rated</option>
      <option value="name">Name (A-Z)</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
    </div>
  </div>
);

const RatingSelect: React.FC<FilterProps> = ({ value, onChange }) => (
  <div className="relative min-w-[140px]">
    <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
    <select 
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer hover:border-indigo-300 dark:hover:border-slate-600 transition-colors shadow-sm"
    >
      <option value="0">All Ratings</option>
      <option value="4.5">4.5+ Stars</option>
      <option value="4">4+ Stars</option>
      <option value="3">3+ Stars</option>
      <option value="2">2+ Stars</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
    </div>
  </div>
);

const App: React.FC = () => {
  // View State: Shop, Confirmation, or Admin
  const [currentView, setCurrentView] = useState<'shop' | 'confirmation' | 'admin'>('shop');
  const [lastOrder, setLastOrder] = useState<Purchase | null>(null);

  const isAdminView = currentView === 'admin';

  // Database Loading
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load from DB Service
    setAllProducts(db.getProducts());
    setPurchases(db.getPurchases());
    setNotifications(db.getNotifications());
    setReviews(db.getReviews());
    setAllUsers(Object.values(db.getUsers()));
  }, []);

  const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(null);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('swapify_db_wishlist');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Compare State
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Payment State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentContext, setPaymentContext] = useState<'cart' | 'swap'>('cart');
  const [pendingSwapData, setPendingSwapData] = useState<{ids: number[], note: string, cash: number} | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sort & Filter State
  const [sortOption, setSortOption] = useState('featured');
  const [minRating, setMinRating] = useState(0);
  
  // Listing Type Toggle (Sale vs Swap)
  const [activeListingType, setActiveListingType] = useState<'sale' | 'swap'>('sale');

  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editProductData, setEditProductData] = useState<Product | null>(null);
  
  // Swap Proposal State
  const [isSwapProposalOpen, setIsSwapProposalOpen] = useState(false);
  const [swapTargetProduct, setSwapTargetProduct] = useState<Product | null>(null);
  
  // Toast Notification State
  const [showToast, setShowToast] = useState<string | null>(null);
  
  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Animation State
  const cartIconRef = useRef<HTMLButtonElement>(null);
  const cartBumpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [flyingItems, setFlyingItems] = useState<{id: number, src: string, start: DOMRect, end: DOMRect}[]>([]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('swapify_db_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const addToCart = (product: Product, sourceRect?: DOMRect) => {
    // Intercept Swap Items for Proposal Modal
    if (product.listingType === 'swap') {
      if (!user) {
        setIsAuthOpen(true); // Require login
        setShowToast("Please sign in to make swap proposals.");
        return;
      }
      setSwapTargetProduct(product);
      setIsSwapProposalOpen(true);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // Trigger Animation
    if (sourceRect && cartIconRef.current) {
      const endRect = cartIconRef.current.getBoundingClientRect();
      const animationId = Date.now();
      setFlyingItems(prev => [...prev, { 
        id: animationId, 
        src: product.image, 
        start: sourceRect, 
        end: endRect 
      }]);
    }
  };

  const removeFlyingItem = (id: number) => {
    setFlyingItems(prev => prev.filter(item => item.id !== id));
    
    // Visual feedback on cart icon
    if (cartIconRef.current) {
      if (cartBumpTimeoutRef.current) {
        clearTimeout(cartBumpTimeoutRef.current);
      }
      
      cartIconRef.current.classList.add('scale-125', 'bg-indigo-100', 'dark:bg-indigo-900', 'text-indigo-600', 'dark:text-indigo-400');
      
      cartBumpTimeoutRef.current = setTimeout(() => {
        if (cartIconRef.current) {
          cartIconRef.current.classList.remove('scale-125', 'bg-indigo-100', 'dark:bg-indigo-900', 'text-indigo-600', 'dark:text-indigo-400');
        }
        cartBumpTimeoutRef.current = null;
      }, 200);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      setIsAuthOpen(true);
      return;
    }

    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setPaymentAmount(total);
    setPaymentContext('cart');
    setIsCartOpen(false); 
    setIsPaymentOpen(true); 
  };

  const handlePaymentComplete = () => {
    setIsPaymentOpen(false);

    if (paymentContext === 'cart') {
      if (!user) return;
      const newPurchase: Purchase = {
        id: Date.now().toString(),
        userEmail: user.email,
        date: new Date().toISOString(),
        items: [...cart],
        total: paymentAmount
      };

      // Save to DB
      const updatedPurchases = db.addPurchase(newPurchase);
      setPurchases(updatedPurchases);
      
      setLastOrder(newPurchase); 
      setCart([]);
      setCurrentView('confirmation');

    } else if (paymentContext === 'swap') {
      if (!user || !swapTargetProduct || !pendingSwapData) return;

      const { ids, note, cash } = pendingSwapData;
      const sellerEmail = swapTargetProduct.addedBy?.email;
      
      if (sellerEmail) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'swap_proposal',
          userId: sellerEmail,
          title: 'New Swap Proposal + Cash',
          message: `${user.name} wants to trade + offered $${cash.toFixed(2)}`,
          read: false,
          date: new Date().toISOString(),
          data: {
              proposerEmail: user.email,
              offeredItemIds: ids,
              targetItemId: swapTargetProduct.id,
              note: note,
              cashOffer: cash
          }
        };
        const updatedNotifications = db.addNotification(newNotification);
        setNotifications(updatedNotifications);
      }
      
      setShowToast("Proposal sent with secure cash offer!");
      setSwapTargetProduct(null);
      setPendingSwapData(null);
    }
  };

  // Wishlist Logic
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const moveWishlistToCart = (product: Product) => {
    addToCart(product); 
  };

  // Compare Logic
  const toggleCompare = (product: Product) => {
    const isAlreadyInList = compareList.some(p => p.id === product.id);

    if (isAlreadyInList) {
      setCompareList(prev => prev.filter(p => p.id !== product.id));
    } else {
      if (compareList.length >= 4) {
        setShowToast("You can compare up to 4 products.");
        return;
      }
      setCompareList(prev => [...prev, product]);
    }
  };

  const removeFromCompare = (id: number) => {
    setCompareList(prev => prev.filter(p => p.id !== id));
  };

  const handleAddReview = (productId: number, rating: number, comment: string) => {
    const newReview: Review = {
      id: Date.now().toString(),
      productId,
      userName: user ? user.name : 'Guest User',
      userAvatar: user ? user.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      rating,
      comment,
      date: new Date().toISOString()
    };

    // Save to DB
    const updatedReviews = db.addReview(newReview);
    setReviews(updatedReviews);

    // Re-calculate Rating
    const productReviews = updatedReviews.filter(r => r.productId === productId);
    const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverageRating = Number((totalRating / productReviews.length).toFixed(1));

    // Update Product in DB
    const targetProduct = allProducts.find(p => p.id === productId);
    if (targetProduct) {
      const updatedProducts = db.updateProduct({ ...targetProduct, rating: newAverageRating });
      setAllProducts(updatedProducts);
    }

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(prev => prev ? { ...prev, rating: newAverageRating } : null);
    }
  };

  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'rating'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: allProducts.length > 0 ? Math.max(...allProducts.map(p => p.id)) + 1 : 1,
      rating: 0,
      addedBy: user ? { name: user.name, avatar: user.avatar, email: user.email } : undefined
    };
    
    const updatedProducts = db.addProduct(newProduct);
    setAllProducts(updatedProducts);
    
    if (isSearching) {
      clearSearch();
    }
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const updated = db.updateProduct(updatedProduct);
    setAllProducts(updated);
    setShowToast("Product updated successfully");
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = db.deleteProduct(id);
      setAllProducts(updatedProducts);
      
      // Cleanup local lists
      removeFromCart(id);
      removeFromWishlist(id);
      removeFromCompare(id);
      
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct(null);
      }
    }
  };

  const handleUpdateUser = (name: string, avatar: string) => {
    if (!user) return;
    const updatedUser = { ...user, name, avatar };
    setUser(updatedUser);
    
    // Save to DB
    const fullUser = db.getUser(user.email);
    if (fullUser) {
      db.saveUser({ ...fullUser, name, avatar });
    }
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    setSortOption('featured');
    setMinRating(0);
    
    try {
      const lowerQuery = query.toLowerCase();
      const simpleMatches = allProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      );

      if (simpleMatches.length > 0 && simpleMatches.length < allProducts.length) {
        setFilteredProducts(simpleMatches);
      } else {
        const matchIds = await searchProductsWithAI(query, allProducts);
        if (matchIds.length > 0) {
          const aiMatches = allProducts.filter(p => matchIds.includes(p.id));
          setFilteredProducts(aiMatches);
        } else {
          setFilteredProducts([]);
        }
      }
    } catch (e) {
      console.error("Search failed", e);
      setFilteredProducts([]);
    }
  };

  const clearSearch = () => {
    setIsSearching(false);
    setSearchQuery('');
    setFilteredProducts(null);
    setSortOption('featured');
    setMinRating(0);
  };

  const handleChatProductClick = (productId: number) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const handleSwapSubmit = (offeredIds: number[], note: string, cashOffer: number) => {
    if (!swapTargetProduct || !user) return;

    if (cashOffer > 0) {
      setPendingSwapData({ ids: offeredIds, note, cash: cashOffer });
      setPaymentAmount(cashOffer);
      setPaymentContext('swap');
      setIsSwapProposalOpen(false);
      setIsPaymentOpen(true);
      return;
    }

    const sellerEmail = swapTargetProduct.addedBy?.email;
    if (sellerEmail) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'swap_proposal',
        userId: sellerEmail,
        title: 'New Swap Proposal',
        message: `${user.name} wants to trade for your ${swapTargetProduct.name}`,
        read: false,
        date: new Date().toISOString(),
        data: {
            proposerEmail: user.email,
            offeredItemIds: offeredIds,
            targetItemId: swapTargetProduct.id,
            note: note,
            cashOffer: 0
        }
      };
      const updated = db.addNotification(newNotification);
      setNotifications(updated);
    }

    setShowToast("Proposal sent! You'll be notified if accepted.");
    setSwapTargetProduct(null);
    setIsSwapProposalOpen(false);
  };

  const handleMarkAllNotificationsRead = () => {
    if (!user) return;
    const updated = db.markNotificationsRead(user.email);
    setNotifications(updated);
  };

  const handleContinueShopping = () => {
    setCurrentView('shop');
    setLastOrder(null);
  };

  const handleAdminEditProduct = (product: Product) => {
    setEditProductData(product);
    setIsAddProductOpen(true);
  };

  // 1. Filter by Search
  let displayedProducts = isSearching && filteredProducts ? filteredProducts : allProducts;
  
  // 2. Filter by Listing Type (Sale vs Swap)
  if (!isSearching) {
    displayedProducts = displayedProducts.filter(p => {
       const type = p.listingType || 'sale';
       return type === activeListingType;
    });
  }

  // 3. Filter by Rating
  const filteredByRating = displayedProducts.filter(p => p.rating >= minRating);
  
  // 4. Sort
  const getSortedProducts = (products: Product[]) => {
    const sorted = [...products];
    switch (sortOption) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  const finalProducts = getSortedProducts(filteredByRating);
  
  const userProducts = user ? allProducts.filter(p => p.addedBy?.email === user.email) : [];
  const userNotifications = user ? notifications.filter(n => n.userId === user.email) : [];
  const unreadNotificationsCount = userNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans relative flex flex-col">
      
      {/* Flying Items Layer */}
      {flyingItems.map(item => (
        <FlyingItem 
          key={item.id} 
          src={item.src} 
          start={item.start} 
          end={item.end} 
          onComplete={() => removeFlyingItem(item.id)} 
        />
      ))}

      {/* Toast Notification */}
      {showToast && <Toast message={showToast} onClose={() => setShowToast(null)} />}

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl shadow-indigo-500/20 rounded-full px-6 py-3 flex items-center gap-4 animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
           <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
               {compareList.map(p => (
                 <img key={p.id} src={p.image} alt="" className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 object-cover" />
               ))}
             </div>
             <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
               {compareList.length} selected
             </span>
           </div>
           <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
           <div className="flex items-center gap-2">
             <button 
               onClick={() => setCompareList([])}
               className="text-xs font-medium text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
             >
               Clear
             </button>
             <Button size="sm" onClick={() => setIsCompareOpen(true)}>
               Compare Products
             </Button>
           </div>
        </div>
      )}

      {/* Advanced Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.4] dark:opacity-[0.15]"></div>
        {/* Orbs */}
        <div className="absolute -top-[10%] right-[10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
      </div>

      <Navbar 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onSearch={handleSearch}
        isSearching={isSearching}
        user={user}
        onLoginClick={() => setIsAuthOpen(true)}
        onAddProductClick={() => {
          setEditProductData(null);
          setIsAddProductOpen(true);
        }}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onProfileClick={() => setIsProfileOpen(true)}
        cartIconRef={cartIconRef}
        activeTab={activeListingType}
        onTabChange={(tab) => {
          setActiveListingType(tab);
          setCurrentView('shop');
        }}
        notificationCount={unreadNotificationsCount}
        onAdminClick={() => setCurrentView(prev => prev === 'admin' ? 'shop' : 'admin')}
        isAdminView={currentView === 'admin'}
      />

      {currentView === 'admin' && user?.role === 'admin' ? (
        <AdminDashboard 
          user={user} 
          products={allProducts} 
          orders={purchases}
          users={allUsers}
          onEditProduct={handleAdminEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      ) : currentView === 'confirmation' ? (
        <div className="relative z-10 max-w-7xl mx-auto flex-grow w-full">
          <OrderConfirmation order={lastOrder} onContinueShopping={handleContinueShopping} />
        </div>
      ) : (
        <>
          {/* Shop View */}
          {!isSearching && (
            <div className="relative z-10 pt-12 pb-8 lg:pt-24 lg:pb-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-8 animate-[fadeIn_0.5s_ease-out] ${activeListingType === 'swap' ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-100 dark:border-orange-800' : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800'}`}>
                  {activeListingType === 'swap' ? <RefreshCw size={14} className="text-orange-500" /> : <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />}
                  <span className={`text-xs font-semibold tracking-wide uppercase ${activeListingType === 'swap' ? 'text-orange-700 dark:text-orange-300' : 'text-indigo-700 dark:text-indigo-300'}`}>
                    {activeListingType === 'swap' ? 'Swap Zone Active' : 'Next Gen Shopping'}
                  </span>
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 animate-[slideUp_0.5s_ease-out]">
                  {activeListingType === 'swap' ? (
                    <>
                      Trade & Exchange <br className="hidden sm:block" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 animate-gradient-x">
                        Sustainability First
                      </span>
                    </>
                  ) : (
                    <>
                      Shopping Reimagined <br className="hidden sm:block" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
                        Intelligent & Curated
                      </span>
                    </>
                  )}
                </h1>
                
                <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300 mb-10 animate-[slideUp_0.7s_ease-out]">
                  {activeListingType === 'swap' 
                    ? "Discover unique items up for trade. Give your old treasures a new home and find something special in return."
                    : "Experience a marketplace where AI understands your style, finds the best deals, and visualizes your perfect match instantly."
                  }
                </p>
              </div>
            </div>
          )}

          <main id="product-grid" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
            {isSearching && (
              <div className="mb-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-xl shadow-indigo-500/5 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Search Results</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {displayedProducts.length}
                      </span>
                    </div>
                    <h2 className="font-bold text-3xl text-slate-900 dark:text-white tracking-tight mt-1">"{searchQuery}"</h2>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                  <RatingSelect value={minRating} onChange={setMinRating} />
                  <SortSelect value={sortOption} onChange={setSortOption} />
                  <button 
                    onClick={clearSearch}
                    className="group flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-white font-medium bg-slate-100 dark:bg-slate-800 hover:bg-red-500 dark:hover:bg-red-500 px-5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap"
                  >
                    <XCircle size={18} className="group-hover:rotate-90 transition-transform" />
                    Clear Search
                  </button>
                </div>
              </div>
            )}

            {displayedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center animate-[fadeIn_0.5s_ease-out] max-w-2xl mx-auto">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-[2rem] border border-white/50 dark:border-slate-700/50 flex items-center justify-center shadow-2xl">
                    <Search size={48} className="text-indigo-500 dark:text-indigo-400" /> 
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">No matches found</h3>
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                  We couldn't find any products matching "<strong>{searchQuery}</strong>" in the {activeListingType === 'swap' ? 'Swap Zone' : 'Store'}. <br className="hidden sm:block" />
                  Try clearing your search or switch tabs.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  {isSearching && (
                    <button 
                      onClick={clearSearch}
                      className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <XCircle size={20} />
                      Clear Search
                    </button>
                  )}
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={20} />
                    Ask AI Assistant
                  </button>
                </div>
              </div>
            ) : (
              <>
                {!isSearching && (
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {activeListingType === 'sale' ? 'Featured Collection' : 'Swap Opportunities'}
                      <span className={`h-1 w-1 rounded-full ${activeListingType === 'sale' ? 'bg-indigo-500' : 'bg-orange-500'}`}></span>
                    </h2>
                    
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Categories */}
                      <div className="hidden md:flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                        {['All', 'Fashion', 'Tech', 'Home'].map((filter) => (
                          <button key={filter} className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all">
                            {filter}
                          </button>
                        ))}
                      </div>

                      {/* Rating Filter Reset */}
                      {!isSearching && minRating > 0 && (
                        <button 
                          onClick={() => setMinRating(0)}
                          className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg transition-colors"
                        >
                          <XCircle size={14} />
                          Clear
                        </button>
                      )}

                      <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
                      
                      <RatingSelect value={minRating} onChange={setMinRating} />
                      <SortSelect value={sortOption} onChange={setSortOption} />
                    </div>
                  </div>
                )}
                
                {finalProducts.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    No products match the selected rating filter.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {finalProducts.map((product, index) => (
                      <div key={product.id} className="animate-[fadeIn_0.5s_ease-out]" style={{ animationDelay: `${index * 50}ms` }}>
                        <ProductCard 
                          product={product} 
                          onAddToCart={(p, r) => {
                             addToCart(p, r);
                          }}
                          onClick={setSelectedProduct}
                          isWishlisted={wishlist.some(w => w.id === product.id)}
                          onToggleWishlist={toggleWishlist}
                          onBuyNow={product.listingType === 'sale' ? handleBuyNow : undefined}
                          onRequestSwap={product.listingType === 'swap' ? (p) => addToCart(p) : undefined}
                          isInCompare={compareList.some(c => c.id === product.id)}
                          onToggleCompare={toggleCompare}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </>
      )}

      {/* Footer (Only show if not admin view) */}
      {!isAdminView && (
        <footer className="relative z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">Swapify</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mb-6">
                  The next generation of e-commerce powered by advanced AI. We're redefining how you discover, shop, and experience products online.
                </p>
                <div className="flex gap-4">
                  <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Twitter size={20} />
                  </button>
                  <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Github size={20} />
                  </button>
                  <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Instagram size={20} />
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-6">Platform</h4>
                <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                  <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">AI Search</a></li>
                  <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Visual Discovery</a></li>
                  <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Trending</a></li>
                  <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sell Products</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
                <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                  <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-500">
                © 2024 Swapify Inc. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-600 uppercase tracking-wider">
                <span>Secure Payments</span>
                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                <span>Global Shipping</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        onRemove={removeFromWishlist}
        onMoveToCart={moveWishlistToCart}
      />

      <AIChatAssistant 
        catalog={allProducts}
        onProductClick={handleChatProductClick}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />

      <ProductDetailsModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, r) => {
           addToCart(p, r);
        }}
        isWishlisted={selectedProduct ? wishlist.some(w => w.id === selectedProduct.id) : false}
        onToggleWishlist={toggleWishlist}
        reviews={selectedProduct ? reviews.filter(r => r.productId === selectedProduct.id) : []}
        onAddReview={handleAddReview}
        onDelete={handleDeleteProduct}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={compareList}
        onAddToCart={(p) => {
           addToCart(p);
           if (p.listingType !== 'swap') {
              setShowToast("Added to cart");
           }
        }}
        onRemove={removeFromCompare}
      />

      <SwapProposalModal
        isOpen={isSwapProposalOpen}
        onClose={() => {
           setIsSwapProposalOpen(false);
           setSwapTargetProduct(null);
        }}
        targetProduct={swapTargetProduct}
        userItems={userProducts}
        onSubmit={handleSwapSubmit}
        onListNewItem={() => {
          setEditProductData(null);
          setIsAddProductOpen(true);
        }}
      />

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={paymentAmount}
        context={paymentContext}
        onPaymentComplete={handlePaymentComplete}
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={setUser} 
      />

      <AddProductModal 
        isOpen={isAddProductOpen} 
        onClose={() => {
          setIsAddProductOpen(false);
          setEditProductData(null);
        }} 
        onAdd={handleAddProduct}
        onUpdate={handleUpdateProduct}
        initialData={editProductData}
      />

      <ProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        userProducts={userProducts}
        purchases={purchases}
        onUpdateProfile={handleUpdateUser}
        onDeleteProduct={handleDeleteProduct}
        notifications={userNotifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />
    </div>
  );
};

export default App;
