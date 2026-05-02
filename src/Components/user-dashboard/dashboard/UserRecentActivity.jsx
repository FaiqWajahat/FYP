import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Package, Box, ChevronRight } from 'lucide-react';

const STAGE_STYLES = {
  "Pending Approval": "bg-amber-50 text-amber-700 border-amber-200/50",
  "In Production":    "bg-blue-50 text-blue-700 border-blue-200/50",
  "Quality Check":    "bg-purple-50 text-purple-700 border-purple-200/50",
  "Dispatched":       "bg-emerald-50 text-emerald-700 border-emerald-200/50",
  "Delivered":        "bg-base-200 text-base-content/50 border-base-300",
};

export default function UserRecentActivity({ orders = [], loading }) {
  if (loading) {
    return (
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 h-96 animate-pulse p-6">
        <div className="h-6 w-48 bg-base-200 rounded mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-base-200/50 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden font-sans">
      <div className="p-6 border-b border-base-200/60 flex justify-between items-center bg-base-100">
        <div>
          <h3 className="text-sm font-black tracking-widest uppercase text-base-content flex items-center gap-3">
             <Package size={18} className="text-primary" /> Active Manufacturing
          </h3>
          <p className="text-[10px] text-base-content/40 font-bold uppercase tracking-tight mt-1">Status of your latest projects</p>
        </div>
        <Link href="/dashboard/orders" className="btn btn-sm bg-base-200 hover:bg-base-300 border-transparent text-[10px] font-black uppercase tracking-widest rounded-xl transition-all gap-2">
           Full Export <ArrowUpRight size={14} className="opacity-50" />
        </Link>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="table table-md w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-base-50/50 text-base-content/40 text-[10px] uppercase font-black tracking-[0.2em]">
              <th className="py-5 pl-8 border-b border-base-200 font-black">Project Details</th>
              <th className="py-5 border-b border-base-200 font-black">Timeline</th>
              <th className="py-5 border-b border-base-200 font-black text-right">Volume</th>
              <th className="py-5 border-b border-base-200 font-black text-right pr-8">Lifecycle</th>
            </tr>
          </thead>
          <tbody>
            {(orders.length > 0 ? orders : []).map((order) => {
              const style = STAGE_STYLES[order.stage] || STAGE_STYLES["Pending Approval"];
              return (
                <tr key={order.rawId} className="hover:bg-base-50 transition-all group">
                  <td className="py-6 pl-8 border-b border-base-100">
                    <div className="flex items-center space-x-4">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-2xl bg-base-200/50 flex items-center justify-center border border-base-content/5 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                          <Box size={18} />
                        </div>
                      </div>
                      <div>
                        <div className="font-black text-xs text-base-content uppercase tracking-tight">#{order.id}</div>
                        <div className="text-[10px] font-bold text-base-content/40 uppercase mt-0.5 truncate max-w-[150px]">
                           {order.product || "Project Sample"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 border-b border-base-100">
                    <p className="text-[11px] font-bold text-base-content/60 font-sans tracking-tight">
                      {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <p className="text-[9px] font-bold text-base-content/20 uppercase tracking-widest mt-1">Date Created</p>
                  </td>
                  <td className="py-6 border-b border-base-100 text-right">
                    <div className="text-xs font-black text-base-content">{order.items.toLocaleString()} <span className="text-[9px] text-base-content/30 ml-0.5">UNITS</span></div>
                    <div className="text-[10px] font-bold text-primary mt-1 tracking-tighter">
                      ${Number(order.total || 0).toLocaleString()} <span className="text-[8px] opacity-40">EST</span>
                    </div>
                  </td>
                  <td className="py-6 border-b border-base-100 text-right pr-8">
                     <div className="flex flex-col items-end gap-2">
                        <div className={`badge badge-sm border ${style} text-[9px] font-black uppercase tracking-widest py-3 px-4 rounded-xl shadow-sm whitespace-nowrap`}>
                          {order.stage || order.status}
                        </div>
                        <Link href={`/dashboard/orders/${order.rawId}`} className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           Track Pipeline <ChevronRight size={10} />
                        </Link>
                     </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && orders.length === 0 && (
           <div className="py-20 flex flex-col items-center justify-center opacity-20">
              <Package size={48} className="mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">No Projects Found</p>
              <p className="text-[10px] font-bold mt-1">Start your manufacturing journey today.</p>
           </div>
        )}
      </div>
    </div>
  );
}
