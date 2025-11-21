
import React, { useState } from 'react';
import { Product, Purchase, User } from '../types';
import { LayoutDashboard, Package, ShoppingBag, Users, Plus, Edit, Trash2, Search, DollarSign, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

interface AdminDashboardProps {
  user: User;
  products: Product[];
  orders: Purchase[];
  users: User[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, 
  products, 
  orders, 
  users, 
  onEditProduct, 
  onDeleteProduct 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  if (user.role !== 'admin') {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <ShieldCheck size={64} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
          <p className="text-slate-500 dark:text-slate-400">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
             <ShieldCheck size={24} />
             <span className="font-bold text-lg tracking-tight">Admin Panel</span>
           </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'overview' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'products' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Package size={20} />
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'orders' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <ShoppingBag size={20} />
            Orders
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'users' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Users size={20} />
            Users
          </button>
        </nav>
        
        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-3">
             <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
             <div>
               <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
               <p className="text-xs text-slate-500 dark:text-slate-400">Super Admin</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        
        {/* Mobile Nav (Simple) */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
           {['Overview', 'Products', 'Orders', 'Users'].map(tab => (
             <button 
               key={tab} 
               onClick={() => setActiveTab(tab.toLowerCase() as any)}
               className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${activeTab === tab.toLowerCase() ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
             >
               {tab}
             </button>
           ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Platform performance overview</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                    <DollarSign size={24} />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                    <ArrowUpRight size={12} /> +12%
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">${totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total Revenue</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                    <ShoppingBag size={24} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{orders.length}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total Orders</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                    <Package size={24} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{products.length}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total Products</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
               <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory</h1>
               <div className="flex w-full sm:w-auto gap-3">
                  <div className="relative flex-1 sm:flex-none">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input 
                       type="text" 
                       placeholder="Search inventory..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                     />
                  </div>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                             <div>
                               <p className="font-medium text-slate-900 dark:text-white text-sm line-clamp-1">{product.name}</p>
                               <p className="text-xs text-slate-500 dark:text-slate-400">ID: #{product.id}</p>
                             </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{product.category}</td>
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {product.listingType === 'swap' ? 'Trade' : `$${product.price.toFixed(2)}`}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => onEditProduct(product)}
                               className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                             >
                               <Edit size={16} />
                             </button>
                             <button 
                               onClick={() => onDeleteProduct(product.id)}
                               className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                             >
                               <Trash2 size={16} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
           <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
             <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders</h1>
             <div className="space-y-4">
               {orders.map(order => (
                 <div key={order.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-4">
                   <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">Order #{order.id.slice(-6).toUpperCase()}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Paid</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{order.userEmail}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(order.date).toLocaleDateString()}</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0,3).map((item, i) => (
                          <img key={i} src={item.image} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 object-cover" alt=""/>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-lg text-slate-900 dark:text-white w-20 text-right">${order.total.toFixed(2)}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
             <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Registered Users</h1>
             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">
                   <tr>
                     <th className="px-6 py-4">User</th>
                     <th className="px-6 py-4">Email</th>
                     <th className="px-6 py-4">Role</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                   {users.map((u, i) => (
                     <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                            <span className="font-medium text-slate-900 dark:text-white">{u.name}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{u.email}</td>
                       <td className="px-6 py-4">
                         <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                           {u.role}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

      </main>
    </div>
  );
};
