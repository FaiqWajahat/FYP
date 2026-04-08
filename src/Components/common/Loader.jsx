"use client";
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Professional Minimalist Loader
 * @param {Object} props
 * @param {string} props.message - Loading message
 * @param {'full' | 'inline' | 'minimal'} props.variant - Loader variant
 */
export default function Loader({ message = "Syncing...", variant = "full" }) {
  const isFull = variant === "full";
  const isMinimal = variant === "minimal";

  const containerClasses = isFull
    ? "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-base-100/95 backdrop-blur-md"
    : isMinimal
      ? "flex items-center gap-3"
      : "flex flex-col items-center justify-center py-24 w-full min-h-[400px]";

  return (
    <div className={containerClasses}>
      {/* Minimalist Spinner Container */}
      <div className={`relative ${isMinimal ? 'w-5 h-5' : 'w-14 h-14'}`}>
        {/* Track Ring */}
        <div className="absolute inset-0 border-[2px] border-base-content/5 rounded-full"></div>
        
        {/* Animated Stroke */}
        <motion.div 
          className="absolute inset-0 border-[2px] border-l-transparent border-t-[var(--primary)] border-r-transparent border-b-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 0.8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        
        {/* Subtle Pulse Center (Selective) */}
        {!isMinimal && (
          <motion.div 
            className="absolute inset-0 border-[2px] border-[var(--primary)]/20 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeOut" 
            }}
          />
        )}
      </div>

      {/* Professional Typography */}
      {!isMinimal && message && (
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-base-content/40 leading-relaxed font-sans">
            {message}
          </p>
          
          {/* Minimalist Progress Line */}
          {isFull && (
            <div className="mt-4 w-12 h-[1px] bg-base-content/5 mx-auto overflow-hidden">
               <motion.div 
                 className="h-full bg-[var(--primary)]/40 w-1/3"
                 animate={{ x: [-48, 48] }}
                 transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                 }}
               />
            </div>
          )}
        </motion.div>
      )}

      {isMinimal && message && (
        <span className="text-[9px] font-bold uppercase tracking-widest text-base-content/50">
          {message}
        </span>
      )}
    </div>
  );
}
