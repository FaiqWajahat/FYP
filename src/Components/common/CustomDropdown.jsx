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
  className = "",
  theme = "daisy" // 'daisy' | 'light'
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

  // NEW: Find the display label for the current value
  const getDisplayLabel = () => {
    if (!value) return placeholder;
    const selectedOption = options.find(opt => 
      (typeof opt === "object" ? opt.value : opt) === value
    );
    return typeof selectedOption === "object" ? selectedOption.label : (selectedOption || value);
  };

  // Get styles based on theme
  const getButtonStyles = () => {
    if (theme === "light") {
      if (disabled) return "opacity-50 bg-slate-100 border-slate-200 cursor-not-allowed";
      if (isOpen) return "border-blue-500 bg-white ring-4 ring-blue-500/15";
      return "bg-white border-slate-200 hover:border-slate-300";
    }
    // Default daisy theme
    if (disabled) return "opacity-50 bg-base-300 cursor-not-allowed";
    if (isOpen) return "border-[var(--primary)] bg-base-100 ring-4";
    return "bg-base-200 border-base-content/10 hover:border-base-content/30";
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 outline-none ${getButtonStyles()}`}
        style={isOpen && theme === 'daisy' ? { '--tw-ring-color': 'color-mix(in srgb, var(--primary) 15%, transparent)' } : {}}
      >
        <span className={
          theme === "light"
            ? (value ? "text-slate-800" : "text-slate-400")
            : (value ? "text-base-content" : "text-base-content/40")
        }>
          {getDisplayLabel()}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronDown className={`w-4 h-4 ${theme === 'light' ? 'text-slate-400' : 'text-base-content/40'}`} />
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
            className={`absolute left-0 top-full z-[1000] w-full mt-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] rounded-xl overflow-hidden py-1 max-h-60 overflow-y-auto font-sans
              ${theme === 'light' ? 'bg-white border border-slate-100' : 'bg-base-100 border border-base-content/10'}
            `}
          >
            {options.length === 0 ? (
              <div className={`px-4 py-3 text-xs italic ${theme === 'light' ? 'text-slate-400' : 'text-base-content/40'}`}>No options available</div>
            ) : (
              <ul className="flex flex-col">
                {options.map((option, idx) => {
                  const optValue = typeof option === "object" ? option.value : option;
                  const optLabel = typeof option === "object" ? option.label : option;
                  const optSub = typeof option === "object" ? option.subLabel : null;
                  const isSelected = value === optValue;

                  return (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => handleSelect(optValue)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors
                          ${theme === 'light'
                            ? (isSelected ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 font-medium hover:bg-slate-50")
                            : (isSelected ? "bg-base-200 text-[var(--primary)] font-bold" : "text-base-content font-medium hover:bg-base-200")
                          }
                        `}
                      >
                        <div className="flex flex-col items-start min-w-0">
                          <span className="truncate">{optLabel}</span>
                          {optSub && <span className="text-[10px] opacity-50 font-medium truncate">{optSub}</span>}
                        </div>
                        {isSelected && <Check className="w-4 h-4 shrink-0 ml-2" />}
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
