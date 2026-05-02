"use client";
import React from "react";
import {
  Edit, Eye, Trash2, ShoppingCart,
  Settings, Scissors, Shirt, PackageSearch,
  FileSignature, Palette, PenTool, ClipboardCheck, Truck, Home
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ConfirmationDialog from "@/Components/common/ConfirmationDialog";

// ─── Stage Meta ───────────────────────────────────────────────────────────────
const STAGE_META = {
  0: { label: "Design/Tech Pack", icon: FileSignature, color: "text-blue-500" },
  1: { label: "Fabric Sourcing", icon: Palette, color: "text-purple-500" },
  2: { label: "Pattern Making", icon: PenTool, color: "text-indigo-500" },
  3: { label: "Sampling", icon: ClipboardCheck, color: "text-amber-500" },
  4: { label: "Bulk Cutting", icon: Scissors, color: "text-orange-500" },
  5: { label: "Printing", icon: Shirt, color: "text-rose-500" },
  6: { label: "Stitching", icon: Settings, color: "text-teal-500" },
  7: { label: "Finishing & QA", icon: PackageSearch, color: "text-cyan-500" },
  8: { label: "Dispatched", icon: Truck, color: "text-emerald-500" },
  9: { label: "Delivered", icon: Home, color: "text-emerald-600" },
};

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

export default function OrdersTable({ orders, onDelete }) {
  const router = useRouter();

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 border-2 border-dashed border-base-content/10 rounded-2xl">
        <ShoppingCart className="w-12 h-12 text-base-content/20" />
        <p className="text-[10px] uppercase font-black tracking-widest text-base-content/40">No Orders Found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full table-md">
        <thead className="text-xs font-semibold text-base-content/70 bg-base-200 uppercase tracking-wide">
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Production Stage</th>
            <th>Value</th>
            <th>Payment</th>

            <th className="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const stageIdx = order.stage_index ?? 0;
            const stage = STAGE_META[stageIdx] ?? STAGE_META[0];
            const StageIcon = stage.icon;
            const isDepositPaid = order.is_deposit_paid;
            const isFinalPaid = order.is_final_paid;

            // Payment badge logic
            let paymentLabel = "Unpaid";
            let paymentClass = "badge-ghost opacity-60";
            if (isDepositPaid && isFinalPaid) {
              paymentLabel = "Fully Paid";
              paymentClass = "badge-success";
            } else if (isDepositPaid) {
              paymentLabel = "Deposit Paid";
              paymentClass = "badge-warning";
            }

            return (
              <tr key={order.id} className="hover:bg-base-200/40 transition">

                {/* Order ID + Date */}
                <td>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-xs font-bold text-[var(--primary)]">
                      #ORD-{1000 + (order.display_id || 0)}
                    </span>
                    <span className="text-[10px] text-base-content/40 hidden md:block">
                      {fmtDate(order.created_at)}
                    </span>
                  </div>
                </td>

                {/* Customer */}
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-9 h-9 rounded-lg overflow-hidden ring-1 ring-base-300 ring-offset-1 bg-base-200">
                        {order.profiles?.profile_image ? (
                          <Image
                            src={order.profiles.profile_image}
                            alt={order.profiles.full_name || "User"}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-black text-base-content/30 bg-base-100 uppercase">
                            {order.profiles?.full_name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs text-base-content">
                        {order.profiles?.full_name || "Guest"}
                      </span>
                      <span className="text-[10px] text-base-content/40 max-w-[130px] truncate">
                        {order.profiles?.email || "—"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Product */}
                <td>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-base-content max-w-[160px] truncate">
                      {order.product_name || "—"}
                    </span>
                    <span className="font-mono text-[10px] text-base-content/40 uppercase">
                      {order.sku}
                    </span>
                  </div>
                </td>

                {/* Production Stage */}
                <td>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <StageIcon size={12} className={stage.color} />
                      <span className="text-[11px] font-medium text-base-content/70">
                        {stage.label}
                      </span>
                    </div>
                    <div className="w-24 bg-base-300 rounded-full h-1 overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary)] transition-all duration-700"
                        style={{ width: `${((stageIdx) / 9) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Value */}
                <td className="font-bold text-sm">
                  {order.total_amount ? fmt(order.total_amount) : "—"}
                </td>

                {/* Payment Status */}
                <td>
                  <span className={`badge badge-outline rounded-lg text-[9px] font-black uppercase tracking-widest ${paymentClass}`}>
                    {paymentLabel}
                  </span>
                </td>

                {/* Date (hidden on mobile, shown in Order col on mobile) */}
                <td className="hidden 2xl:table-cell text-[10px] text-base-content/50 font-medium">
                  {fmtDate(order.created_at)}
                </td>

                {/* Actions */}
                <td>
                  <div className="flex justify-end items-center gap-1">
                    <button
                      onClick={() => router.push(`/admin/Orders/OrderDetails?id=${order.id}`)}
                      className="btn btn-ghost btn-circle btn-xs hover:bg-base-300 p-1"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(order)}
                      className="btn btn-ghost btn-circle btn-xs hover:bg-base-300 hover:text-error p-1"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
