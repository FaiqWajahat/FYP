"use client";
import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export default function SplitPaymentModule() {
  const [paymentMode, setPaymentMode] = useState('50-50'); // 'full' or '50-50'
  const totalAmount = 5000;
  
  const handleToggle = (mode) => {
    setPaymentMode(mode);
  };

  const getMilestones = () => {
    if (paymentMode === 'full') {
      return [
        { id: 1, name: 'Full Payment', amount: totalAmount, status: 'due', dueDate: 'Immediately' }
      ];
    }
    return [
      { id: 1, name: 'Initial Deposit (50%)', amount: totalAmount / 2, status: 'paid', date: 'Oct 5, 2026' },
      { id: 2, name: 'Final Payment (50%)', amount: totalAmount / 2, status: 'due', dueDate: 'Before Shipping' }
    ];
  };

  const milestones = getMilestones();
  const paidAmount = milestones.filter(m => m.status === 'paid').reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 p-5 flex flex-col h-full relative overflow-hidden">
      
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-base-200/60">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-base-content/80 uppercase tracking-wider">
           <CreditCard size={16} style={{ color: 'var(--primary)' }} /> Payment
        </h3>
        
        {/* Toggle between Full Payment and 50/50 */}
        <div className="join bg-base-200 p-0.5 rounded-md">
           <button 
             onClick={() => handleToggle('full')} 
             className={`join-item btn btn-xs border-none hover:bg-base-300 ${paymentMode === 'full' ? 'bg-base-100 shadow-sm text-base-content' : 'bg-transparent text-base-content/60'}`}
           >
             Full
           </button>
           <button 
             onClick={() => handleToggle('50-50')} 
             className={`join-item btn btn-xs border-none hover:bg-base-300 ${paymentMode === '50-50' ? 'bg-base-100 shadow-sm text-base-content' : 'bg-transparent text-base-content/60'}`}
           >
             50/50 Split
           </button>
        </div>
      </div>
      
      <div className="space-y-5 flex-grow font-sans text-sm">
        <div className="bg-base-200/30 p-4 rounded-lg border border-base-200/50">
          <p className="text-xs font-medium mb-1 text-base-content/60 uppercase tracking-widest">Total Value</p>
          <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--primary)' }}>${totalAmount.toLocaleString()}</p>
          
          <div className="w-full bg-base-200 rounded-full h-1 mt-3 overflow-hidden">
             <div className="h-full bg-success transition-all duration-500" style={{ width: `${(paidAmount / totalAmount) * 100}%` }}></div>
          </div>
          
          <div className="flex justify-between text-[11px] mt-1.5 font-mono">
            <span className="text-success font-semibold">${paidAmount.toLocaleString()} Paid</span>
            <span className="text-base-content/50">${(totalAmount - paidAmount).toLocaleString()} Remaining</span>
          </div>
        </div>

        <div className="space-y-2">
          
          {milestones.map((milestone) => (
            <div key={milestone.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${milestone.status === 'paid' ? 'bg-success/5 border-success/10' : milestone.status === 'due' ? 'bg-base-100 border-base-300 shadow-sm' : 'bg-base-100/50 border-base-200/50 opacity-60'}`}>
              
              <div className="flex items-center gap-3">
                {milestone.status === 'paid' ? (
                  <CheckCircle size={16} className="text-success" />
                ) : milestone.status === 'due' ? (
                  <AlertCircle size={16} style={{ color: 'var(--primary)' }} />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-base-300"></div>
                )}
                
                <div>
                  <p className={`font-semibold text-xs ${milestone.status === 'due' ? 'text-base-content' : 'text-base-content/70'}`}>
                     {milestone.name}
                  </p>
                  <p className="text-[10px] mt-0.5 text-base-content/50 font-mono">
                     {milestone.status === 'paid' ? `Paid on ${milestone.date}` : `Due: ${milestone.dueDate}`}
                  </p>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end">
                <p className={`font-bold text-sm ${milestone.status === 'due' ? 'text-base-content' : 'text-base-content/70'}`}>
                  ${milestone.amount.toLocaleString()}
                </p>
                {milestone.status === 'due' && (
                  <button className="btn btn-xs mt-1.5 px-3 h-6 min-h-0 rounded text-[10px] hover:opacity-90 transition-opacity border-none text-white tracking-wide uppercase font-semibold" style={{ backgroundColor: 'var(--primary)' }}>
                    Pay Now
                  </button>
                )}
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
