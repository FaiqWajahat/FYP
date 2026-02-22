'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag,
  Truck
} from 'lucide-react';

// ==============================================
// DUMMY DATA (Simulating a real database)
// ==============================================
const INITIAL_ITEMS = [
  {
    id: 1,
    name: "Heavyweight Cotton Hoodie",
    variant: "Black / Size L",
    price: 25.00,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Performance Track Jacket",
    variant: "Navy Blue / Size M",
    price: 32.50,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop"
  }
];

const CartButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState(INITIAL_ITEMS);

  // --- CART LOGIC ---

  // Calculate Subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const freeShippingThreshold = 100;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  // Update Quantity
  const updateQuantity = (id, change) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  // Remove Item
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Lock Body Scroll when Open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      {/* ==============================================
          1. THE TRIGGER BUTTON (Navbar Icon)
          ============================================== */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="relative group z-50 pointer-events-auto"
      >
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-slate-600 hover:text-blue-600 bg-slate-50 rounded-full hover:bg-blue-50 transition-colors"
        >
          <ShoppingCart size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-red-600 flex items-center justify-center rounded-full text-[10px] font-bold text-white border-2 border-white shadow-sm">
              {totalItems}
            </span>
          )}
        </motion.div>
      </button>

      {/* ==============================================
          2. THE SLIDE-OVER DRAWER
          ============================================== */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* BACKDROP OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[99998]"
            />

            {/* DRAWER PANEL */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[99999] w-full max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-slate-100"
            >
              
              {/* --- HEADER --- */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white z-10">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  Your Cart <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">({totalItems})</span>
                </h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-red-500"
                >
                  <X size={24} />
                </button>
              </div>

              {/* --- SCROLLABLE CONTENT --- */}
              <div className="flex-1 overflow-y-auto p-5">
                
                {cartItems.length === 0 ? (
                  // EMPTY STATE
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
                    <ShoppingBag size={64} strokeWidth={1} />
                    <div>
                      <p className="text-lg font-bold text-slate-900">Your cart is empty</p>
                      <p className="text-sm">Looks like you haven't added anything yet.</p>
                    </div>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  // CART ITEMS LIST
                  <div className="space-y-6">
                    {/* Free Shipping Progress Bar */}
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 mb-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-800 mb-2">
                         <Truck size={14} />
                         {progress < 100 
                           ? `Spend $${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Shipping` 
                           : "You've unlocked Free Shipping!"}
                      </div>
                      <div className="h-2 w-full bg-blue-200 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-blue-600 rounded-full"
                        />
                      </div>
                    </div>

                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 group">
                        {/* Item Image */}
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex flex-1 flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{item.name}</h3>
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{item.variant}</p>
                          </div>
                          
                          <div className="flex items-end justify-between">
                            <p className="text-sm font-bold text-slate-900">${item.price.toFixed(2)}</p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 bg-slate-100 rounded-lg px-2 py-1">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 hover:text-blue-600 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 hover:text-blue-600 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* --- FOOTER (CHECKOUT) --- */}
              {cartItems.length > 0 && (
                <div className="border-t border-slate-100 bg-slate-50 p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Shipping</span>
                      <span className={progress >= 100 ? "text-green-600 font-bold" : ""}>
                        {progress >= 100 ? "Free" : "Calculated at checkout"}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-95 transition-all shadow-lg">
                    Checkout Securely <ArrowRight size={18} />
                  </button>
                  <p className="text-[10px] text-center text-slate-400">
                    Taxes and shipping calculated at checkout.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartButton;