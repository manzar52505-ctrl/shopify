
import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, DollarSign, Tag, Type, FileText, Trash2, Star, GripVertical, RefreshCw, ShoppingBag, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { Product } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id' | 'rating'>) => void;
  onUpdate?: (product: Product) => void;
  initialData?: Product | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd, onUpdate, initialData }) => {
  const [listingType, setListingType] = useState<'sale' | 'swap'>('sale');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    category: string;
    description: string;
    images: string[];
    swapPreferences: string;
  }>({
    name: '',
    price: '',
    category: 'Fashion',
    description: '',
    images: [],
    swapPreferences: ''
  });
  
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setListingType(initialData.listingType);
      setFormData({
        name: initialData.name,
        price: initialData.price > 0 ? initialData.price.toString() : '',
        category: initialData.category,
        description: initialData.description,
        images: initialData.images || [initialData.image],
        swapPreferences: initialData.swapPreferences || ''
      });
    } else if (isOpen && !initialData) {
      // Reset for new
      setFormData({ name: '', price: '', category: 'Fashion', description: '', images: [], swapPreferences: '' });
      setListingType('sale');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      let processedCount = 0;
      
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            newImages.push(reader.result as string);
          }
          processedCount++;
          if (processedCount === files.length) {
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const setPrimaryImage = (index: number) => {
    if (index === 0) return;
    const newImages = [...formData.images];
    const [image] = newImages.splice(index, 1);
    newImages.unshift(image);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === targetIndex) return;

    const newImages = [...formData.images];
    const [draggedImage] = newImages.splice(draggingIndex, 1);
    newImages.splice(targetIndex, 0, draggedImage);

    setFormData(prev => ({ ...prev, images: newImages }));
    setDraggingIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Price Validation for Sale Items
    if (listingType === 'sale') {
      const priceValue = parseFloat(formData.price);
      if (!formData.price || isNaN(priceValue) || priceValue <= 0) {
        setError("Please enter a valid price greater than $0.00 for sale items.");
        return;
      }
    }

    const finalImages = formData.images.length > 0 
      ? formData.images 
      : [`https://picsum.photos/seed/${Math.random()}/400/400`];

    const productData = {
      name: formData.name,
      price: listingType === 'sale' ? parseFloat(formData.price) : 0,
      category: formData.category,
      description: formData.description,
      image: finalImages[0],
      images: finalImages,
      listingType: listingType,
      swapPreferences: listingType === 'swap' ? formData.swapPreferences : undefined
    };

    if (initialData && onUpdate) {
      onUpdate({
        ...initialData,
        ...productData
      });
    } else {
      onAdd(productData);
    }
    
    setFormData({ name: '', price: '', category: 'Fashion', description: '', images: [], swapPreferences: '' });
    setListingType('sale');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out] border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {initialData ? 'Edit Product' : 'List Item'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2 animate-[fadeIn_0.2s_ease-out]">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Toggle Listing Type */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => { setListingType('sale'); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${listingType === 'sale' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
              >
                <ShoppingBag size={16} />
                For Sale
              </button>
              <button
                type="button"
                onClick={() => { setListingType('swap'); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${listingType === 'swap' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
              >
                <RefreshCw size={16} />
                For Swap
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Item Name</label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder={listingType === 'sale' ? "e.g., Neon Leather Jacket" : "e.g., Vintage Camera"}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {listingType === 'sale' ? 'Price' : 'Estimated Value (Optional)'}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    required={listingType === 'sale'}
                    disabled={listingType === 'swap'}
                    value={listingType === 'swap' ? '' : formData.price}
                    onChange={e => {
                      setFormData({...formData, price: e.target.value});
                      if (error) setError(null);
                    }}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={listingType === 'swap' ? "Trade only" : "0.00"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none"
                  >
                    <option>Fashion</option>
                    <option>Electronics</option>
                    <option>Home</option>
                    <option>Sports</option>
                    <option>Accessories</option>
                    <option>Books</option>
                    <option>Collectibles</option>
                  </select>
                </div>
              </div>
            </div>

            {listingType === 'swap' && (
              <div className="space-y-2 animate-[fadeIn_0.3s_ease-out]">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">What do you want in exchange?</label>
                <div className="relative">
                  <RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" size={16} />
                  <input 
                    type="text"
                    required={listingType === 'swap'}
                    value={formData.swapPreferences}
                    onChange={e => setFormData({...formData, swapPreferences: e.target.value})}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-orange-200 dark:border-orange-900/30 bg-orange-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="e.g., Guitar, Sci-Fi books, or open to offers"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Item Images</label>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              
              <div className="grid grid-cols-3 gap-3">
                {formData.images.map((img, index) => (
                  <div 
                    key={index} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border group transition-all cursor-move
                      ${index === 0 
                        ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900' 
                        : 'border-slate-200 dark:border-slate-700'
                      }
                      ${draggingIndex === index ? 'opacity-50 scale-95' : 'opacity-100'}
                    `}
                  >
                    <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover pointer-events-none" />
                    
                    {/* Primary Badge */}
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
                        Primary
                      </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                          className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-sm transition-transform hover:scale-110"
                          title="Remove Image"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                         <div className="text-white/80">
                           <GripVertical size={16} />
                         </div>
                         {index !== 0 && (
                           <button
                             type="button"
                             onClick={(e) => { e.stopPropagation(); setPrimaryImage(index); }}
                             className="bg-white/90 dark:bg-slate-800/90 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-md text-[10px] font-bold shadow-sm flex items-center gap-1 hover:bg-white hover:scale-105 transition-all"
                           >
                             <Star size={10} fill="currentColor" />
                             Set Primary
                           </button>
                         )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800/50 transition-all"
                >
                  <Upload className="text-slate-400 dark:text-slate-300 mb-1" size={20} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Add Photos</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 flex justify-between">
                <span>Upload multiple images. Drag to reorder.</span>
                <span>{formData.images.length} images selected</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[100px] resize-none"
                  placeholder={listingType === 'sale' ? "Describe features..." : "Describe condition and functionality..."}
                />
              </div>
            </div>

            <Button 
              className={`w-full py-3 mt-4 shadow-lg ${listingType === 'swap' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : 'shadow-indigo-500/20'}`}
            >
              {initialData ? 'Update Product' : (listingType === 'sale' ? 'List Product' : 'List for Swap')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
