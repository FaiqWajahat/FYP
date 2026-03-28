'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Slash } from 'lucide-react';

const Breadcrumbs = ({ items }) => {

  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol className="flex items-center gap-1.5 backdrop-blur-sm px-4 py-2 rounded-lg  border-slate-200  transition-all ">
        
        {/* Optional: Always show a Home Icon at start if you want */}
        <li className="flex items-center">
          <Link 
            href="/" 
            className="p-1 text-slate-400 hover:text-[var(--primary)] hover:bg-blue-50 rounded-md transition-all"
            title="Go to Dashboard"
          >
            <span className='flex items-center gap-2 text-sm'>  <Home size={13} /> Factory Flow</span>
          </Link>
        </li>

        {/* Separator */}
        <li className="text-slate-300" aria-hidden="true">
          <Slash size={10} className="-rotate-12" />
        </li>

        {/* Loop through items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              <li className="flex items-center">
                {isLast ? (
                  // Active Page (Not Clickable, Bold, Colored)
                  <span 
                    className="flex items-center gap-2 text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  // Parent Link (Clickable, Subtle)
                  <Link 
                    href={item.href}
                    className="text-xs font-medium text-slate-500 hover:text-blue-600 hover:underline decoration-blue-200 underline-offset-4 transition-colors px-1"
                  >
                    {item.label}
                  </Link>
                )}
              </li>

              {/* Add Separator if not the last item */}
              {!isLast && (
                <li className="text-slate-300" aria-hidden="true">
                  <ChevronRight size={12} strokeWidth={2.5} />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;