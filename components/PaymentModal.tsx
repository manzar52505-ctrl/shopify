import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, CheckCircle, Loader2, ShieldCheck, Wallet, Globe, Smartphone, Copy } from 'lucide-react';
import { Button } from './Button';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentComplete: () => void;
  context: 'cart' | 'swap';
}

type PaymentMethod = 'card' | 'paypal' | 'sadapay';

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  amount, 
  onPaymentComplete,
  context
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  
  // Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  
  // SadaPay State
  const [transactionId, setTransactionId] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  // Processing State
  const [processingStep, setProcessingStep] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const SADAPAY_NUMBER = "0308 0620762";

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setCardNumber('');
      setCardName('');
      setExpiry('');
      setCvc('');
      setSaveCard(false);
      setTransactionId('');
      setProcessingStep('');
      setIsSuccess(false);
      setPaymentMethod('card');
    }
  }, [isOpen]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SADAPAY_NUMBER.replace(/\s/g, ''));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let steps: string[] = [];

    if (paymentMethod === 'card') {
      steps = ['Encrypting data...', 'Contacting bank...', 'Authorizing transaction...', 'Approved'];
    } else if (paymentMethod === 'paypal') {
      steps = ['Connecting to PayPal...', 'Verifying credentials...', 'Processing payment...', 'Confirmed'];
    } else if (paymentMethod === 'sadapay') {
      if (!transactionId) return;
      steps = ['Verifying Transaction ID...', 'Checking receipt...', 'Funds Received', 'Payment Confirmed'];
    }

    for (const step of steps) {
      setProcessingStep(step);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    }
    
    setIsSuccess(true);
    
    setTimeout(() => {
      onPaymentComplete();
    }, 1500);
  };

  if (!isOpen) return null;

  const isProcessing = !!processingStep;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={!isProcessing && !isSuccess ? onClose : undefined}
      />
      
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out] border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-green-500" size={20} />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Secure Checkout</h2>
          </div>
          {!isProcessing && !isSuccess && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 animate-[fadeIn_0.3s_ease-out]">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 animate-[bounce_0.5s_ease-out]">
                <CheckCircle className="text-green-500 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Successful!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-center">
                {context === 'cart' ? 'Your order has been verified and placed.' : 'Your cash offer has been secured.'}
              </p>
              <div className="mt-6 text-xs text-slate-400 font-mono">
                Transaction ID: {paymentMethod === 'sadapay' ? transactionId : Math.random().toString(36).substr(2, 9).toUpperCase()}
              </div>
            </div>
          ) : isProcessing ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-[fadeIn_0.3s_ease-out]">
               <div className="relative">
                 <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
                 <Loader2 className="text-indigo-600 dark:text-indigo-400 w-12 h-12 animate-spin relative z-10" />
               </div>
               <div className="text-center space-y-1">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">{processingStep}</h3>
                 <p className="text-xs text-slate-500 dark:text-slate-400">Please do not close this window</p>
               </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Method Selection */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`relative p-2 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'card' 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500' 
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <CreditCard size={20} />
                  <span className="text-[10px] font-bold">Card</span>
                  {paymentMethod === 'card' && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>}
                </button>
                
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`relative p-2 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'paypal' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500' 
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Globe size={20} />
                  <span className="text-[10px] font-bold">PayPal</span>
                  {paymentMethod === 'paypal' && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
                </button>

                <button
                  onClick={() => setPaymentMethod('sadapay')}
                  className={`relative p-2 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'sadapay' 
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 ring-1 ring-teal-500' 
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Smartphone size={20} />
                  <span className="text-[10px] font-bold">SadaPay</span>
                  {paymentMethod === 'sadapay' && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-teal-500 rounded-full"></div>}
                </button>
              </div>

              <form onSubmit={handlePayment} className="space-y-4">
                {paymentMethod === 'card' && (
                  <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                       {/* Compact Card View */}
                       <div className="space-y-3">
                        <div className="relative">
                          <input 
                            type="text"
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            className="peer w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono transition-all placeholder-transparent"
                            placeholder="Card Number"
                            id="card-input"
                          />
                          <label htmlFor="card-input" className="absolute left-10 -top-2 bg-white dark:bg-slate-900 px-1 text-[10px] font-bold text-slate-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-indigo-500">Card Number</label>
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>

                        <div className="flex gap-3">
                           <div className="relative flex-1">
                              <input 
                                type="text"
                                required
                                maxLength={5}
                                value={expiry}
                                onChange={(e) => {
                                  let v = e.target.value.replace(/[^0-9]/g, '');
                                  if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
                                  setExpiry(v);
                                }}
                                className="peer w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-center placeholder-transparent"
                                placeholder="MM/YY"
                                id="expiry-input"
                              />
                              <label htmlFor="expiry-input" className="absolute left-4 -top-2 bg-white dark:bg-slate-900 px-1 text-[10px] font-bold text-slate-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-indigo-500">Expiry</label>
                           </div>
                           <div className="relative flex-1">
                              <input 
                                type="password"
                                required
                                maxLength={4}
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                                className="peer w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-center placeholder-transparent"
                                placeholder="CVC"
                                id="cvc-input"
                              />
                              <label htmlFor="cvc-input" className="absolute left-4 -top-2 bg-white dark:bg-slate-900 px-1 text-[10px] font-bold text-slate-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-indigo-500">CVC</label>
                           </div>
                        </div>
                        
                        <div className="relative">
                          <input 
                            type="text"
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value.toUpperCase())}
                            className="peer w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase placeholder-transparent"
                            placeholder="Cardholder Name"
                            id="name-input"
                          />
                           <label htmlFor="name-input" className="absolute left-4 -top-2 bg-white dark:bg-slate-900 px-1 text-[10px] font-bold text-slate-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-indigo-500">Cardholder Name</label>
                        </div>
                       </div>

                       <div className="flex items-center gap-2 px-1">
                         <input 
                            type="checkbox" 
                            id="save-card" 
                            checked={saveCard}
                            onChange={(e) => setSaveCard(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                         />
                         <label htmlFor="save-card" className="text-xs text-slate-600 dark:text-slate-400">Save this card for future purchases</label>
                       </div>

                       <Button className="w-full py-4 text-base shadow-lg shadow-indigo-500/30 bg-indigo-600 hover:bg-indigo-700">
                        Pay ${amount.toFixed(2)}
                       </Button>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="space-y-6 py-4 animate-[fadeIn_0.3s_ease-out]">
                    <div className="text-center space-y-2">
                       <div className="w-16 h-16 mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                         <Globe className="text-blue-500" size={32} />
                       </div>
                       <p className="text-sm text-slate-600 dark:text-slate-300">
                         You will be redirected to PayPal to complete your purchase securely.
                       </p>
                    </div>
                    
                    <Button className="w-full py-4 text-base shadow-lg shadow-blue-500/30 bg-[#0070BA] hover:bg-[#005EA6] border-none">
                       Pay ${amount.toFixed(2)} with PayPal
                    </Button>
                  </div>
                )}

                {paymentMethod === 'sadapay' && (
                  <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                    <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 text-center">
                      <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase mb-1">Send Amount to</p>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white tracking-wider">{SADAPAY_NUMBER}</span>
                        <button 
                          type="button"
                          onClick={copyToClipboard}
                          className="p-1.5 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-600 dark:text-teal-400 transition-colors"
                          title="Copy Number"
                        >
                          {isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Account Title: Swapify Store</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Transaction ID (Trx ID)</label>
                      <input 
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter the ID from your SMS/App receipt"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-400 px-1">
                        After sending <strong>${amount.toFixed(2)}</strong> to {SADAPAY_NUMBER}, enter the transaction ID received in the confirmation SMS/App notification to verify your payment.
                      </p>
                    </div>

                    <Button 
                      disabled={!transactionId}
                      className="w-full py-4 text-base shadow-lg shadow-teal-500/30 bg-teal-600 hover:bg-teal-700 border-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Verify Payment
                    </Button>
                  </div>
                )}

                <div className="flex justify-center items-center gap-2 pt-2 text-[10px] text-slate-400">
                  <Lock size={10} />
                  <span>256-bit SSL Encrypted Payment</span>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
