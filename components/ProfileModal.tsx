
import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Save, Package, Trash2, Edit2, Camera, Clock, ShoppingBag, ChevronRight, Bell, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { User, Product, Purchase, Notification } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  userProducts: Product[];
  purchases: Purchase[];
  onUpdateProfile: (name: string, avatar: string) => void;
  onDeleteProduct: (id: number) => void;
  notifications?: Notification[];
  onMarkAllRead?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  userProducts, 
  purchases,
  onUpdateProfile,
  onDeleteProduct,
  notifications = [],
  onMarkAllRead
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'listings' | 'history' | 'notifications'>('profile');
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditAvatar(user.avatar);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editName, editAvatar);
    setIsEditing(false);
  };

  const userPurchases = purchases.filter(p => p.userEmail === user.email).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out] border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Account</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'notifications' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'history' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            Order History
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-1 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'listings' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            Listings ({userProducts.length})
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-900">
          {activeTab === 'profile' && (
            <div className="max-w-md mx-auto">
              <div className="flex flex-col items-center mb-8">
                <div className="relative group cursor-pointer" onClick={() => setIsEditing(true)}>
                  <img 
                    src={isEditing ? editAvatar : user.avatar} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800 object-cover" 
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                      <Camera size={24} className="text-white" />
                    </div>
                  )}
                </div>
                {!isEditing && (
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 size={14} className="mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </div>

              {isEditing && (
                <form onSubmit={handleSaveProfile} className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Avatar URL</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editAvatar}
                        onChange={(e) => setEditAvatar(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <button
                        type="button" 
                        onClick={() => setEditAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`)}
                        className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                        title="Generate Random"
                      >
                        🎲
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button type="submit" className="flex-1">
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => {
                        setIsEditing(false);
                        setEditName(user.name);
                        setEditAvatar(user.avatar);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
                 {unreadCount > 0 && onMarkAllRead && (
                   <button onClick={onMarkAllRead} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                     Mark all as read
                   </button>
                 )}
               </div>
               
               {notifications.length === 0 ? (
                 <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                   <Bell size={48} className="mx-auto mb-4 opacity-50" />
                   <p>No notifications yet.</p>
                 </div>
               ) : (
                 notifications.map(notification => (
                   <div 
                     key={notification.id} 
                     className={`p-4 rounded-xl border transition-all ${notification.read ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700' : 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800'}`}
                   >
                     <div className="flex items-start gap-3">
                       <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${notification.read ? 'bg-slate-100 dark:bg-slate-700 text-slate-500' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                         {notification.type === 'swap_proposal' ? <RefreshCw size={16} /> : <Bell size={16} />}
                       </div>
                       <div className="flex-1">
                         <div className="flex justify-between items-start">
                           <h4 className={`text-sm font-bold ${notification.read ? 'text-slate-700 dark:text-slate-200' : 'text-slate-900 dark:text-white'}`}>
                             {notification.title}
                           </h4>
                           <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                             {new Date(notification.date).toLocaleDateString()}
                           </span>
                         </div>
                         <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                           {notification.message}
                         </p>
                         {!notification.read && (
                           <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> New
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 ))
               )}
            </div>
          )}

          {activeTab === 'history' && (
             <div className="space-y-4">
              {userPurchases.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No purchase history found.</p>
                  <p className="text-sm mt-2">Go buy something nice!</p>
                </div>
              ) : (
                userPurchases.map(purchase => (
                  <div key={purchase.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Order Placed</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-400" />
                          {new Date(purchase.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Total</p>
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${purchase.total.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {purchase.items.map((item, idx) => (
                        <div key={`${purchase.id}-${idx}`} className="flex gap-3 items-center">
                          <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-600">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
             </div>
          )}

          {activeTab === 'listings' && (
            <div className="space-y-4">
              {userProducts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Package size={48} className="mx-auto mb-4 opacity-50" />
                  <p>You haven't added any products yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userProducts.map(product => (
                    <div key={product.id} className="flex bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group">
                      <img src={product.image} alt={product.name} className="w-24 h-24 object-cover" />
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">{product.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">${product.price.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-end">
                          <button 
                            onClick={() => onDeleteProduct(product.id)}
                            className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
