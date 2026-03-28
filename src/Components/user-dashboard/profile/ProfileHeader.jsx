import React from 'react';
import { Camera, MapPin, Building2, UserCircle2 } from 'lucide-react';

export default function ProfileHeader() {
  return (
    <div className="relative w-full bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden font-sans mb-8">
      {/* Banner Area */}
      <div className="h-32 md:h-48 w-full bg-gradient-to-r from-[var(--primary)]/90 to-[var(--primary)]/60 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <button className="absolute top-4 right-4 md:top-6 md:right-6 btn btn-sm btn-ghost bg-black/40 text-white hover:bg-black/60 border-none backdrop-blur-sm shadow-md">
          <Camera size={16} className="mr-1" /> <span className="hidden sm:inline">Edit Cover</span>
        </button>
      </div>

      {/* Profile Details Area */}
      <div className="px-6 sm:px-8 md:px-12 pb-8 md:pb-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 md:gap-8 -mt-16 md:-mt-20 relative z-10 w-full">
        
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full md:w-auto">
           {/* Avatar */}
           <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-full ring-4 ring-base-100 shadow-xl bg-base-200 flex items-center justify-center select-none">
                <span className="text-4xl md:text-5xl font-extrabold text-[var(--primary)] leading-none">JD</span>
              </div>
              <button className="absolute bottom-1 right-1 btn btn-circle btn-sm bg-[var(--primary)] text-white hover:bg-[var(--primary)]/80 border-none shadow-md">
                <Camera size={14} />
              </button>
           </div>

           {/* Text Details */}
           <div className="text-center md:text-left mb-2 w-full md:w-auto">
              <h2 className="text-2xl md:text-3xl font-extrabold text-base-content tracking-tight">John Doe</h2>
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-4 mt-2 text-sm text-base-content/70 font-medium">
                 <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <Building2 size={16} className="opacity-60 text-[var(--primary)] shrink-0" /> Acme Corp Logistics
                 </span>
                 <span className="hidden sm:inline w-1 h-1 rounded-full bg-base-content/20"></span>
                 <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <UserCircle2 size={16} className="opacity-60 text-[var(--primary)] shrink-0" /> Senior Procurement Officer
                 </span>
                 <span className="hidden lg:inline w-1 h-1 rounded-full bg-base-content/20"></span>
                 <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <MapPin size={16} className="opacity-60 text-[var(--primary)] shrink-0" /> New York, USA
                 </span>
              </div>
           </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
           <button className="btn btn-primary w-full md:w-auto uppercase tracking-wider font-bold text-xs shadow-md shadow-primary/20">
             Save Profile
           </button>
        </div>

      </div>
    </div>
  );
}
