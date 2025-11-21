
import React, { useState } from 'react';
import { Product } from '../types';
import { X, RefreshCw, Plus, Check, ArrowRight, DollarSign } from 'lucide-react';
import { Button } from './Button';

interface SwapProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProduct: Product | null;
  userItems: Product[];
  onSubmit: (offeredItemIds: number[], note: string, cashOffer: number) => void;
  onListNewItem: () => void;
}

export const SwapProposalModal: React.FC<SwapProposalModalProps> = ({
  isOpen,
  onClose,
  targetProduct,
  userItems,
  onSubmit,
  onListNewItem
}) => {
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [note, setNote] = useState('');
  const [cashOffer, setCashOffer] = useState('');

  if (!isOpen || !targetProduct) return null;

  const toggleSelection = (id: number) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedItemIds, note, parseFloat(cashOffer) || 0);
    setSelectedItemIds([]);
    setNote('');
    setCashOffer('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-[scaleIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="text-orange-500" size={20} />
              Propose Trade
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Offering items for <span className="font-semibold text-slate-700 dark:text-slate-300">{targetProduct.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex justify-between items-center">
              <span>Select items to offer</span>
              <span className="text-xs font-normal text-slate-500">{selectedItemIds.length} selected</span>
            </h3>
            
            {userItems.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">You haven't listed any items to trade yet.</p>
                <Button onClick={() => { onClose(); onListNewItem(); }} variant="outline" className="border-dashed">
                  <Plus size={16} className="mr-2" />
                  List Your First Item
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                {userItems.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => toggleSelection(item.id)}
                    className={`relative p-2 rounded-xl border-2 cursor-pointer transition-all group ${selectedItemIds.includes(item.id) ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700/50'}`}
                  >
                    <div className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                      <div className="flex-1 min-w-0">
                         <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                         <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{item.category}</p>
                      </div>
                    </div>
                    {selectedItemIds.includes(item.id) && (
                      <div className="absolute top-[-6px] right-[-6px] bg-orange-500 text-white rounded-full p-0.5 shadow-sm animate-[scaleIn_0.2s_ease-out]">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Cash Offer Input */}
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl">
              <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-2">
                <DollarSign size={16} />
                Price Match / Cash Top-up
              </h3>
              <p className="text-xs text-indigo-700/70 dark:text-indigo-300/70 mb-3">
                Offer cash to bridge a value gap or sweeten the deal.
              </p>
              <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                 <input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={cashOffer}
                    onChange={(e) => setCashOffer(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Add a note (optional)</label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none text-sm transition-all"
                placeholder="Hi, I'm interested in your item. Would you consider trading for..."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={userItems.length === 0 || selectedItemIds.length === 0}
            className={`transition-all ${userItems.length === 0 || selectedItemIds.length === 0 ? 'opacity-50 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'}`}
          >
            <span>{parseFloat(cashOffer) > 0 ? 'Proceed to Payment' : 'Send Proposal'}</span>
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
