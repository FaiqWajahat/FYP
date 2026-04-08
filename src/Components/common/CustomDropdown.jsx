"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomDropdown({ 
  options = [], 
  value = "", 
  onChange, 
  placeholder = "Select an option", 
  disabled = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 outline-none
          ${disabled ? "opacity-50 bg-base-300 cursor-not-allowed" : "cursor-pointer"}
          ${isOpen ? "border-[var(--primary)] bg-base-100 ring-4" : "bg-base-200 border-base-content/10 hover:border-base-content/30"}
        `}
        style={isOpen ? { '--tw-ring-color': 'color-mix(in srgb, var(--primary) 15%, transparent)' } : {}}
      >
        <span className={value ? "text-base-content" : "text-base-content/40"}>
          {value || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronDown className="w-4 h-4 text-base-content/40" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -5, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -5, scaleY: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 top-full z-[99] w-full mt-2 bg-base-100 border border-base-content/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] rounded-xl overflow-hidden py-1 max-h-60 overflow-y-auto"
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-xs text-base-content/40 italic">No options available</div>
            ) : (
              <ul className="flex flex-col">
                {options.map((option, idx) => {
                  const optValue = typeof option === "object" ? option.value : option;
                  const optLabel = typeof option === "object" ? option.label : option;
                  const isSelected = value === optValue;

                  return (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => handleSelect(optValue)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors
                          ${isSelected ? "bg-base-200 text-[var(--primary)] font-bold" : "text-base-content font-medium hover:bg-base-200"}
                        `}
                      >
                        <span className="truncate">{optLabel}</span>
                        {isSelected && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
