"use client";
import React from 'react';
import { CreditCard, DollarSign } from 'lucide-react';

export default function OrderPaymentSummary({ paymentStatus = 'Paid', subtotal = 1200, shipping = 50, discount = 100, tax = 20 }) {
  const total = subtotal + shipping + tax - discount;
  
  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center border-b border-base-200 pb-4 mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
           <DollarSign size={20} className="text-primary" /> Payment Summary
        </h3>
        <span className={`badge ${paymentStatus === 'Paid' ? 'badge-success' : 'badge-error'} font-semibold p-3`}>
          {paymentStatus}
        </span>
      </div>
      
      <div className="space-y-3 flex-grow">
        <div className="flex justify-between text-base-content/70">
          <span>Subtotal</span>
          <span className="font-medium text-base-content">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base-content/70">
          <span>Shipping Fee</span>
          <span className="font-medium text-base-content">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base-content/70">
          <span>Discount (PROMO10)</span>
          <span className="font-medium text-success">-${discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base-content/70">
          <span>Estimated Tax</span>
          <span className="font-medium text-base-content">${tax.toFixed(2)}</span>
        </div>
        
        <div className="divider my-2"></div>
        
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Grand Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-6 bg-base-200 p-4 rounded-lg flex items-center gap-4">
        <CreditCard size={28} className="text-base-content/60" />
        <div>
          <p className="font-medium text-sm">Visa ending in 4242</p>
          <p className="text-xs text-base-content/60">Paid on Oct 24, 2026, 14:30 PM</p>
        </div>
      </div>
    </div>
  );
}
