import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, Loader2, Image as ImageIcon, Zap } from 'lucide-react';
import { ChatMessage, Product } from '../types';
import { chatWithShoppingAssistant } from '../services/geminiService';

interface AIChatAssistantProps {
  catalog: Product[];
  onProductClick: (productId: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ catalog, onProductClick, isOpen, onToggle }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', text: "Hello! I'm Swapify AI. I can analyze products, find deals, or scan images. How can I assist you today?" }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isThinking]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isThinking) return;

    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: input,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const imageToSend = selectedImage;
    setSelectedImage(null); // Clear preview immediately
    setIsThinking(true);

    // Mock history (not used fully in this stateless demo version but ready structure)
    const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));

    const response = await chatWithShoppingAssistant(history, userMsg.text || "What do you think about this image?", imageToSend, catalog);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response.text,
      suggestedProductIds: response.productIds
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsThinking(false);
  };

  const handleProductPreviewClick = (id: number) => {
    onProductClick(id);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-6 w-[90vw] sm:w-[400px] h-[600px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700 shadow-indigo-500/10 flex flex-col overflow-hidden animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)] origin-bottom-right flex-shrink-0">
          
          {/* Glassy Header */}
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl p-4 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-md opacity-50 animate-pulse"></div>
                <div className="relative w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <Sparkles size={18} className="text-white" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Swapify Intelligence</h3>
                <p className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Online</p>
              </div>
            </div>
            <button 
              onClick={onToggle}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`
                    max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm relative
                    ${msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-500/20' 
                      : 'bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50 rounded-bl-none'
                    }
                  `}
                >
                  {msg.image && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                      <img src={msg.image} alt="Uploaded" className="w-full max-h-48 object-cover" />
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Suggested Products */}
                {msg.suggestedProductIds && msg.suggestedProductIds.length > 0 && (
                  <div className="mt-4 w-full max-w-[95%] pl-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={12} className="text-indigo-500" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Recommendations</p>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 px-1 no-scrollbar snap-x">
                      {msg.suggestedProductIds.map(id => {
                        const product = catalog.find(p => p.id === id);
                        if (!product) return null;
                        return (
                          <div 
                            key={id}
                            onClick={() => handleProductPreviewClick(id)}
                            className="flex-shrink-0 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer hover:ring-2 ring-indigo-500 transition-all snap-start hover:-translate-y-1 duration-300"
                          >
                            <div className="aspect-square bg-slate-100 dark:bg-slate-900">
                              <img src={product.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-2.5">
                              <div className="font-bold text-xs text-slate-900 dark:text-white truncate mb-1">{product.name}</div>
                              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">${product.price}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isThinking && (
              <div className="flex justify-start animate-[fadeIn_0.3s_ease-out]">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-t border-slate-200/50 dark:border-slate-700/50">
            {selectedImage && (
              <div className="mb-3 relative inline-block animate-[slideIn_0.2s_ease-out]">
                <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-xl border-2 border-indigo-500" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 shadow-lg hover:bg-red-500 transition-colors transform hover:scale-110"
                >
                  <X size={10} />
                </button>
              </div>
            )}
            
            <div className="flex items-end gap-2 relative">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageSelect}
              />
              
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-sm transition-opacity opacity-0 group-focus-within:opacity-100"></div>
                <div className="absolute left-2 bottom-2 flex items-center">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                    title="Upload image"
                  >
                    <ImageIcon size={20} />
                  </button>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={selectedImage ? "Ask about this..." : "Type your message..."}
                  className="w-full bg-slate-100 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none no-scrollbar max-h-24 placeholder-slate-500 dark:placeholder-slate-400 border border-transparent focus:border-indigo-500/20"
                  rows={1}
                />
              </div>

              <button 
                onClick={handleSend}
                disabled={(!input.trim() && !selectedImage) || isThinking}
                className="p-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-800 dark:disabled:to-slate-800 disabled:cursor-not-allowed text-white rounded-2xl transition-all shadow-lg shadow-indigo-500/30 disabled:shadow-none flex-shrink-0 active:scale-95"
              >
                <Send size={18} className={isThinking ? "opacity-0" : "opacity-100"} />
                {isThinking && <Loader2 size={18} className="absolute top-3.5 left-3.5 animate-spin" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button - Advanced Orb Design */}
      <button
        onClick={onToggle}
        className={`
          relative group flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500
          ${isOpen ? 'rotate-90' : 'hover:scale-110'}
        `}
      >
        {/* Pulsing Rings */}
        {!isOpen && (
          <>
            <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            <div className="absolute inset-0 bg-purple-500 rounded-full opacity-20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-2000"></div>
          </>
        )}
        
        {/* Main Orb */}
        <div className={`
          absolute inset-0 rounded-full shadow-2xl shadow-indigo-500/40 border border-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden
          ${isOpen ? 'bg-slate-900 dark:bg-slate-800' : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800'}
        `}>
          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
          
          {isOpen ? (
            <X size={28} className="text-white relative z-10" />
          ) : (
            <Sparkles size={28} fill="currentColor" className="text-white relative z-10 opacity-90" />
          )}
        </div>
      </button>
    </div>
  );
};