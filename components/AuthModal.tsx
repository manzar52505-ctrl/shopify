
import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { User } from '../types';
import { db } from '../services/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const isAdminEmail = (email: string) => {
    return email.toLowerCase() === 'admin@swapify.com';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Basic Validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Allow non-gmail only for admin
    if (!isAdminEmail(email) && !email.toLowerCase().endsWith('@gmail.com')) {
      setError('Please use a valid Google Mail (@gmail.com) address.');
      return;
    }

    if (!isLogin && !name) {
      setError('Please enter your name.');
      return;
    }

    const lowerEmail = email.toLowerCase();

    if (isLogin) {
      // --- LOGIN LOGIC ---
      
      // Check for hardcoded admin
      if (isAdminEmail(lowerEmail) && password === 'admin123') {
         const adminUser: User = {
           name: 'Swapify Admin',
           email: lowerEmail,
           avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
           role: 'admin'
         };
         onLogin(adminUser);
         onClose();
         return;
      }

      const userRecord = db.getUser(lowerEmail);

      if (!userRecord) {
        setError('Account not found. Please sign up first.');
        return;
      }

      if (userRecord.password !== password) {
        setError('Invalid password. Please try again.');
        return;
      }

      // Login Successful
      const user: User = {
        name: userRecord.name,
        email: userRecord.email,
        avatar: userRecord.avatar,
        role: userRecord.role || 'user'
      };
      onLogin(user);
      onClose();

    } else {
      // --- SIGNUP LOGIC ---
      if (db.getUser(lowerEmail)) {
        setError('An account with this email already exists. Please sign in.');
        return;
      }

      const newUser: User & { password: string } = {
        name,
        email: lowerEmail,
        password, // In a real app, never store plain text passwords!
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        role: 'user'
      };

      // Save to DB
      db.saveUser(newUser);

      // Auto login after signup
      onLogin({
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role
      });
      onClose();
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out] border border-slate-200 dark:border-slate-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {isLogin ? 'Enter your credentials to access your account' : 'Join Swapify to start shopping'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder={isAdminEmail(email) ? "Admin Email" : "you@gmail.com"}
                />
                {isAdminEmail(email) && (
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 animate-pulse">
                     <ShieldCheck size={18} />
                   </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button className="w-full py-3 mt-2 shadow-lg shadow-indigo-500/20">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={toggleMode}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center justify-center gap-1 mx-auto group"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
