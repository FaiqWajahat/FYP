import React from 'react';
import { Eye, ThumbsUp, ThumbsDown, Maximize2, Download } from 'lucide-react';

export default function MockupCard({ mockup, statusColors, handleAction, setSelectedMockup }) {
  return (
    <div className="group flex flex-col bg-base-100 rounded-xl shadow-sm hover:shadow-md border border-base-200/80 overflow-hidden transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full bg-base-200 overflow-hidden cursor-pointer" onClick={() => setSelectedMockup(mockup)}>
        <img src={mockup.url} alt={mockup.type} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded backdrop-blur-md border text-[10px] font-bold uppercase tracking-widest ${statusColors[mockup.status]}`}>
          {mockup.status}
        </div>

        {/* Version Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 text-white text-[10px] font-mono shadow-sm">
          {mockup.version}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="btn btn-circle btn-sm bg-white/20 border-white/40 text-white backdrop-blur-sm hover:bg-white hover:text-black hover:scale-110 transition-all">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-bold text-sm text-base-content uppercase tracking-wide">{mockup.type}</h4>
            <p className="text-xs text-base-content/50 mt-0.5 font-mono">{mockup.date}</p>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded border border-[var(--primary)]/20">
            {mockup.orderId}
          </span>
        </div>

        <p className="text-xs text-base-content/70 line-clamp-2 mt-1 mb-4 flex-1">
          {mockup.notes}
        </p>

        {/* Actions */}
        <div className="mt-auto pt-3 border-t border-base-200/60">
          {mockup.status === 'pending' ? (
            <div className="flex gap-2 w-full">
              <button onClick={() => handleAction(mockup.id, 'approved')} className="btn btn-success btn-sm flex-1 text-xs uppercase tracking-wider font-bold">
                <ThumbsUp size={14} /> Approve
              </button>
              <button onClick={() => handleAction(mockup.id, 'rejected')} className="btn btn-error btn-outline btn-sm flex-1 text-xs uppercase tracking-wider font-bold">
                <ThumbsDown size={14} /> Reject
              </button>
            </div>
          ) : (
            <div className="flex gap-2 w-full">
              <button onClick={() => setSelectedMockup(mockup)} className="btn btn-ghost border-base-200 btn-sm w-full bg-base-100 hover:bg-base-200 text-xs uppercase tracking-wider font-bold text-base-content/70 flex-1">
                <Eye size={14} /> Details
              </button>
              {mockup.status === 'approved' && (
                <button onClick={(e) => { e.stopPropagation(); window.open(mockup.url, '_blank'); }} className="btn btn-ghost border-base-200 btn-sm bg-base-100 hover:bg-base-200 text-[var(--primary)] flex-none px-3" title="Download">
                  <Download size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
