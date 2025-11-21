
import React from 'react';
import { Purchase } from '../types';
import { CheckCircle, Package, Truck, ArrowRight, Calendar, MapPin, Copy } from 'lucide-react';
import { Button } from './Button';

interface OrderConfirmationProps {
  order: Purchase | null;
  onContinueShopping: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onContinueShopping }) => {
  if (!order) return null;

  // Calculate estimated delivery (5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-[calc(100vh-20rem)] max-w-4xl mx-auto px-4 py-12 animate-[fadeIn_0.5s_ease-out]">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg animate-[bounce_0.5s_ease-out]">
              <CheckCircle className="text-indigo-600 w-10 h-10" strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-indigo-100 text-lg">Thank you for your purchase.</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-mono">
              <span>Order #{order.id.slice(-8).toUpperCase()}</span>
              <Copy size={14} className="cursor-pointer hover:text-indigo-200" />
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Status & Details */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Delivery Status */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Estimated Delivery</h3>
                <p className="text-green-600 dark:text-green-400 font-medium mt-1 mb-2">
                  Arriving by {formattedDelivery}
                </p>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-green-500 w-1/4 rounded-full relative">
                    <div className="absolute top-0 bottom-0 right-0 w-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-wide">
                  <span>Processing</span>
                  <span>Shipped</span>
                  <span>Delivered</span>
                </div>
              </div>
            </div>

            {/* Shipping Address (Mock) */}
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Shipping Address</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  {order.userEmail}<br />
                  123 Innovation Drive<br />
                  Silicon Valley, CA 94025
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                <Package size={20} className="text-indigo-500" />
                Items Ordered
              </h4>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{item.name}</h5>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900 dark:text-white">${item.price.toFixed(2)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl h-fit border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Payment Summary</h3>
            
            <div className="space-y-3 text-sm border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax (Estimated)</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-slate-900 dark:text-white font-bold">Total Paid</span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${order.total.toFixed(2)}</span>
            </div>

            <Button onClick={onContinueShopping} className="w-full py-4 shadow-lg shadow-indigo-500/20 group">
              Continue Shopping
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400">Need help? <a href="#" className="text-indigo-500 hover:underline">Contact Support</a></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
