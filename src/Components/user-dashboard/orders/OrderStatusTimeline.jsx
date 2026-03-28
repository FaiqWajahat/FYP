"use client";
import React from 'react';
import { Package, Truck, CheckCircle, CreditCard, Clock } from 'lucide-react';

const STAGES = [
  { name: 'Order Placed', icon: Clock },
  { name: 'Payment Confirmed', icon: CreditCard },
  { name: 'Production', icon: Package },
  { name: 'Shipped', icon: Truck },
  { name: 'Delivered', icon: CheckCircle },
];

export default function OrderStatusTimeline({ currentStatus }) {
  // Determine current step index based on status
  let currentIndex = 0;
  if (currentStatus === 'Payment Pending') currentIndex = 0;
  if (currentStatus === 'Processing') currentIndex = 1;
  if (currentStatus === 'Production') currentIndex = 2;
  if (currentStatus === 'Shipped') currentIndex = 3;
  if (currentStatus === 'Completed') currentIndex = 4;

  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 p-8 w-full">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        Order Status
      </h3>
      
      <div className="w-full overflow-x-auto pb-4">
        <ul className="steps steps-horizontal w-full min-w-[600px]">
          {STAGES.map((stage, index) => {
            const Icon = stage.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <li 
                key={stage.name} 
                className={`step ${isCompleted ? 'step-primary font-medium' : 'text-base-content/40'}`}
                data-content={isCompleted ? "✓" : ""}
              >
                <div className="flex flex-col items-center mt-2 gap-2">
                  <div className={`p-3 rounded-full ${isCompleted ? 'bg-primary/10 text-primary' : 'bg-base-200 text-base-content/40'} ${isCurrent && 'ring-2 ring-primary ring-offset-2 ring-offset-base-100'}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-sm mt-1">{stage.name}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
