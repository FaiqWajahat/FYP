import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Package, Box } from 'lucide-react';

const RECENT_ORDERS = [
  { id: 'ORD-9982', date: 'Oct 10, 2026', items: 340, total: '$1,200', status: 'In Production', color: 'success' },
  { id: 'ORD-9975', date: 'Sep 28, 2026', items: 1500, total: '$4,500', status: 'Pending Approval', color: 'warning' },
  { id: 'ORD-9950', date: 'Aug 15, 2026', items: 850, total: '$2,850', status: 'Delivered', color: 'base-content/40' },
  { id: 'ORD-9912', date: 'Jul 02, 2026', items: 200, total: '$800', status: 'Delivered', color: 'base-content/40' },
  { id: 'ORD-9880', date: 'May 20, 2026', items: 4000, total: '$12,400', status: 'Delivered', color: 'base-content/40' },
];

export default function UserRecentActivity() {
  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden font-sans">
      <div className="p-5 border-b border-base-200/60 flex justify-between items-center">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-base-content/80 flex items-center gap-2">
           <Package size={16} className="text-primary" /> Recent Orders Overview
        </h3>
        <Link href="/dashboard/orders" className="btn btn-sm btn-ghost text-xs text-primary font-bold uppercase tracking-wider">
           View All <ArrowUpRight size={14} className="opacity-70" />
        </Link>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="table table-zebra table-sm md:table-md w-full">
          <thead>
            <tr className="bg-base-200/40 text-base-content/60 text-[10px] uppercase font-bold tracking-widest border-b border-base-200">
              <th className="font-bold py-4">Order ID</th>
              <th className="font-bold py-4">Date Placed</th>
              <th className="font-bold py-4 text-right">Volume</th>
              <th className="font-bold py-4 text-right">Total Spend</th>
              <th className="font-bold py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map((order, idx) => (
              <tr key={order.id} className="hover border-b border-base-200/50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-8 h-8 bg-primary/10 flex items-center justify-center">
                        <Box size={14} className="text-primary" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-xs">{order.id}</div>
                      <div className="text-[10px] opacity-60 font-mono mt-0.5">Manufacturing</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-xs font-medium text-base-content/80 font-mono">
                  {order.date}
                </td>
                <td className="py-4 text-xs font-bold text-right">
                  {order.items.toLocaleString()} units
                </td>
                <td className="py-4 text-xs font-bold text-right text-base-content/80">
                  {order.total}
                </td>
                <td className="py-4 text-center">
                   <div className={`badge badge-sm border bg-${order.color}/10 border-${order.color}/30 text-${order.color} text-[10px] uppercase font-bold tracking-widest py-2.5 px-3`}>
                     {order.status}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

