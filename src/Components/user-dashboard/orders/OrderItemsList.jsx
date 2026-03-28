"use client";
import React from 'react';

const MOCK_ITEMS = [
  { id: 1, name: 'Premium Cotton Blend T-Shirt', sku: 'TS-PR-CBL-01', price: 12.50, quantity: 100, total: 1250.00, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
  { id: 2, name: 'Custom Embroidered Hoodie', sku: 'HD-EMB-CU-42', price: 25.00, quantity: 50, total: 1250.00, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80' },
];

export default function OrderItemsList({ items = MOCK_ITEMS }) {
  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden h-full flex flex-col w-full">
      <div className="p-6 border-b border-base-200">
        <h3 className="text-lg font-semibold flex items-center gap-2">
           Items Ordered
        </h3>
      </div>
      
      <div className="overflow-x-auto flex-grow">
        <table className="table w-full">
          <thead className="bg-base-200/50">
            <tr>
              <th>Product</th>
              <th className="hidden md:table-cell">Price</th>
              <th>Qty</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-base-200 last:border-0 hover">
                <td>
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-lg relative overflow-hidden bg-base-300">
                        {item.img && <img src={item.img} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm line-clamp-2 leading-tight max-w-[200px]">{item.name}</div>
                      <div className="text-xs text-base-content/60 mt-1 font-mono">{item.sku}</div>
                      {/* Show price on mobile */}
                      <div className="md:hidden text-xs font-semibold mt-1">${item.price.toFixed(2)}</div>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell align-middle text-sm font-medium">
                  ${item.price.toFixed(2)}
                </td>
                <td className="align-middle">
                  <div className="badge badge-neutral px-3">{item.quantity}</div>
                </td>
                <td className="text-right font-semibold text-primary align-middle">
                  ${item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
