"use client";
import React from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";

export default function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Delete", 
  type = "danger",
  isLoading = false
}) {
  if (!isOpen) return null;

  const isDanger = type === "danger";

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-base-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={!isLoading ? onClose : undefined}
      />
      
      {/* Dialog Box */}
      <div className="relative bg-base-100 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-base-content/10 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full shrink-0 ${isDanger ? "bg-error/10 text-error" : "bg-warning/10 text-warning"}`}>
              {isDanger ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            
            <div className="flex-1 pt-1">
              <h3 className="text-xl font-black text-base-content tracking-tight">{title}</h3>
              <p className="mt-2 text-sm text-base-content/60 font-medium leading-relaxed">
                {message}
              </p>
            </div>

            <button 
              onClick={onClose}
              disabled={isLoading}
              className="p-1 rounded-full hover:bg-base-200 transition-colors shrink-0"
            >
              <X className="w-5 h-5 text-base-content/40" />
            </button>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl border border-base-content/10 font-bold text-sm text-base-content/70 hover:bg-base-200 transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${
                isDanger 
                  ? "bg-error hover:bg-error/90 shadow-error/20" 
                  : "bg-warning hover:bg-warning/90 shadow-warning/20"
              }`}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
