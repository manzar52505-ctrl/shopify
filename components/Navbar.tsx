
import React, { useState } from 'react';
import { ShoppingCart, Search, Repeat, Sparkles, Sun, Moon, User as UserIcon, PlusCircle, LogIn, Heart, ShoppingBag, RefreshCw, LayoutDashboard } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onSearch: (query: string) => void;
  isSearching: boolean;
  user: User | null;
  onLoginClick: () => void;
  onAddProductClick: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onProfileClick: () => void;
  cartIconRef?: React.RefObject<HTMLButtonElement>;
  activeTab: 'sale' | 'swap';
  onTabChange: (tab: 'sale' | 'swap') => void;
  notificationCount?: number;
  onAdminClick?: () => void;
  isAdminView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onOpenCart, 
  wishlistCount,
  onOpenWishlist,
  onSearch, 
  isSearching,
  user,
  onLoginClick,
  onAddProductClick,
  isDarkMode,
  toggleTheme,
  onProfileClick,
  cartIconRef,
  activeTab,
  onTabChange,
  notificationCount = 0,
  onAdminClick,
  isAdminView
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-white/20 dark:border-slate-800/50 transition-all duration-300">
      {/* Subtle Gradient Border Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer group select-none" 
            onClick={() => window.location.reload()}
          >
            <div className="relative">
              {/* Animated Glow */}
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
              
              {/* Icon Container */}
              <div className="relative w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/10 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 border border-white/10 dark:border-slate-200/50">
                <Repeat className="text-white dark:text-indigo-600 transform group-hover:rotate-180 transition-transform duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)" size={20} strokeWidth={2.5} />
              </div>
            </div>
            <div className="hidden sm:flex flex-col justify-center h-10">
              <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white leading-none">
                Swapify
                <span className="text-indigo-500 inline-block animate-pulse">.</span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.25em] text-slate-400 dark:text-slate-500 uppercase leading-none ml-0.5 group-hover:text-indigo-500 transition-colors duration-300">
                AI Store
              </span>
            </div>
          </div>

          {!isAdminView && (
            <>
              {/* Navigation Tabs (Desktop) */}
              <div className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/50 p-1 rounded-xl mr-4 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md">
                <button
                  onClick={() => onTabChange('sale')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all duration-200 ${activeTab === 'sale' ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  <ShoppingBag size={14} />
                  Store
                </button>
                <button
                  onClick={() => onTabChange('swap')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all duration-200 ${activeTab === 'swap' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  <RefreshCw size={14} />
                  Swap Zone
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl">
                <form onSubmit={handleSubmit} className="relative group">
                  <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-md transition-opacity opacity-0 group-focus-within:opacity-100"></div>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    {isSearching ? (
                      <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
                    ) : (
                      <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="relative z-0 block w-full pl-12 pr-4 py-3 rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800/80 border border-transparent focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-sm shadow-inner"
                    placeholder="Ask AI to find anything..."
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-10">
                    <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-md text-[10px] font-medium text-slate-400 dark:text-slate-300 backdrop-blur-sm">
                      <span>⌘</span><span>K</span>
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* Admin Header Override */}
          {isAdminView && (
             <div className="flex-1 flex justify-center">
               <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/30">
                 Administrator Mode
               </div>
             </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Admin Toggle */}
            {user?.role === 'admin' && onAdminClick && (
              <button
                onClick={onAdminClick}
                className={`p-2 rounded-lg transition-colors font-bold text-xs flex items-center gap-2 ${isAdminView ? 'bg-slate-800 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
              >
                <LayoutDashboard size={16} />
                {isAdminView ? 'Exit Admin' : 'Dashboard'}
              </button>
            )}

            {/* Add Product (User) */}
            {user && !isAdminView && (
              <button
                onClick={onAddProductClick}
                className="hidden sm:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-4 py-2 rounded-full text-sm font-semibold transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800/50"
              >
                <PlusCircle size={18} />
                <span>Add</span>
              </button>
            )}

             {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-full transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {!isAdminView && (
              <>
                {/* Wishlist */}
                <button 
                  onClick={onOpenWishlist}
                  className="relative p-3 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-full transition-all duration-200 group"
                >
                  <Heart size={22} className="group-hover:scale-110 transition-transform" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-[scaleIn_0.2s_ease-out]">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Cart */}
                <button 
                  ref={cartIconRef}
                  onClick={onOpenCart}
                  className="relative p-3 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-full transition-all duration-200 group"
                >
                  <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-[scaleIn_0.2s_ease-out]">
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Profile / Login */}
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
            
            {user ? (
              <div 
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity relative group"
                onClick={onProfileClick}
              >
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="relative w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 object-cover shadow-sm" 
                />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="relative overflow-hidden flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
                <LogIn size={16} />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
