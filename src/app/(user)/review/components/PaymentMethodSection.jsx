'use client';

import React from 'react';
import { CreditCard, AlertCircle, DollarSign, Landmark, Globe, Banknote } from 'lucide-react';

export const PAYMENT_METHODS = [
  {
    id: 'paypal',
    name: 'PayPal',
    icon: DollarSign,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    borderSelected: 'border-blue-600',
    bgSelected: 'bg-blue-50/60',
    description: 'Fast & widely accepted. Funds released to your PayPal account instantly.',
    fee: '4.4% + $0.30 per transaction',
    feeNote: 'Buyer pays via PayPal. Seller receives after ~4.4% fee deduction.',
    badge: 'Most Common',
    badgeColor: 'bg-blue-100 text-blue-700',
    feePercent: 0.044,
    feeFixed: 0.30,
  },
  {
    id: 'bank',
    name: 'Direct Bank Transfer (T/T)',
    icon: Landmark,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    borderSelected: 'border-emerald-600',
    bgSelected: 'bg-emerald-50/60',
    description: 'Telegraphic Transfer (Wire) directly to your Pakistani bank account.',
    fee: '$35 flat SWIFT fee per transfer',
    feeNote: 'Buyer pays SWIFT fee to their bank. Arrival in 2–5 business days.',
    badge: 'Lowest Cost',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    feePercent: 0,
    feeFixed: 35,
  },
  {
    id: 'western_union',
    name: 'Western Union',
    icon: Globe,
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    borderSelected: 'border-yellow-500',
    bgSelected: 'bg-yellow-50/60',
    description: 'Cash pickup or direct bank deposit. Available across Pakistan.',
    fee: '~2% of transfer amount',
    feeNote: 'Fee varies by country & amount. Typically collected from sender.',
    badge: 'Fast Pickup',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    feePercent: 0.02,
    feeFixed: 0,
  },
  {
    id: 'payoneer',
    name: 'Payoneer',
    icon: Banknote,
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    borderSelected: 'border-orange-500',
    bgSelected: 'bg-orange-50/60',
    description: 'Receive payment to your Payoneer account and withdraw to any Pakistani bank.',
    fee: '3% (credit/debit card) or 1% (Payoneer-to-Payoneer)',
    feeNote: 'Payoneer withdrawal to a local bank costs ~$3 per transfer.',
    badge: 'Freelancer Fav',
    badgeColor: 'bg-orange-100 text-orange-700',
    feePercent: 0.03,
    feeFixed: 3,
  },
];

function RadioDot({ selected, color = 'border-blue-600' }) {
  return (
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? color : 'border-slate-300'}`}>
      {selected && <div className="w-2.5 h-2.5 bg-current rounded-full" />}
    </div>
  );
}

export default function PaymentMethodSection({ selectedMethodId, onMethodSelect }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><CreditCard size={20} /></div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
          <p className="text-xs text-slate-500 mt-0.5">Choose how the buyer will send you the payment.</p>
        </div>
      </div>

      <div className="space-y-4">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethodId === method.id;
          return (
            <div
              key={method.id}
              onClick={() => onMethodSelect(method)}
              className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${isSelected ? `${method.borderSelected} ${method.bgSelected} shadow-sm` : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-2.5 ${method.bg} ${method.color} rounded-xl flex-shrink-0`}>
                  <Icon size={20} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-slate-900 text-sm">{method.name}</p>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${method.badgeColor}`}>
                        {method.badge}
                      </span>
                    </div>
                    <RadioDot selected={isSelected} color={method.borderSelected} />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{method.description}</p>

                  {/* Transfer Fees Box */}
                  <div className={`mt-3 p-3 rounded-xl border ${isSelected ? 'border-slate-200 bg-white/70' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex items-start gap-2">
                      <AlertCircle size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold text-slate-700 mb-0.5">Transfer Charges</p>
                        <p className="text-[11px] font-black text-amber-700">{method.fee}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{method.feeNote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
