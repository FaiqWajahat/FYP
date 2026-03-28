import React from 'react';
import { X, Check, ThumbsDown, ThumbsUp, AlertCircle, Download } from 'lucide-react';

export default function MockupDetailModal({ selectedMockup, setSelectedMockup, statusColors, handleAction }) {
   if (!selectedMockup) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-300/80 backdrop-blur-sm" onClick={() => setSelectedMockup(null)}>
         <div className="bg-base-100 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-base-200" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-base-200 bg-base-100/50">
               <div>
                  <h3 className="font-bold text-lg uppercase tracking-wide flex items-center gap-2">
                     {selectedMockup.type}
                     <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColors[selectedMockup.status]}`}>
                        {selectedMockup.status}
                     </span>
                  </h3>
                  <div className="flex items-center gap-4 text-xs mt-1 text-base-content/60 font-mono">
                     <span>ID: {selectedMockup.id}</span>
                     <span>Order: {selectedMockup.orderId}</span>
                     <span>Rev: {selectedMockup.version}</span>
                  </div>
               </div>
               <button onClick={() => setSelectedMockup(null)} className="btn btn-ghost btn-circle btn-sm">
                  <X size={18} />
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
               {/* Image Area */}
               <div className="flex-1 bg-base-200/50 flex items-center justify-center p-4 overflow-auto min-h-[300px] relative">
                  <img src={selectedMockup.url} alt={selectedMockup.type} className="max-w-full max-h-full object-contain rounded drop-shadow-lg" />
               </div>

               {/* Details Area */}
               <div className="w-full md:w-80 bg-base-100 p-6 flex flex-col border-l border-base-200 overflow-y-auto">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-4">Mockup Information</h4>

                  <div className="space-y-4 flex-1">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 mb-1">Date Uploaded</p>
                        <p className="text-sm font-medium">{selectedMockup.date}</p>
                     </div>

                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 mb-1">Designer Notes</p>
                        <div className="bg-base-200/50 p-3 rounded-lg text-sm border border-base-200">
                           {selectedMockup.notes || 'No designer notes provided.'}
                        </div>
                     </div>

                     {selectedMockup.status === 'pending' && (
                        <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg flex gap-3 text-warning-content mt-4">
                           <AlertCircle size={18} className="text-warning flex-none mt-0.5" />
                           <p className="text-xs">This design requires your approval before manufacturing can proceed. Please review carefully.</p>
                        </div>
                     )}

                     {selectedMockup.status === 'approved' && (
                        <div className="bg-success/10 border border-success/20 p-3 rounded-lg flex gap-3 text-success mt-4">
                           <Check size={18} className="flex-none mt-0.5" />
                           <p className="text-xs">You approved this mockup. Manufacturing is either cleared or in progress based on this design.</p>
                        </div>
                     )}

                     {selectedMockup.status === 'rejected' && (
                        <div className="bg-error/10 border border-error/20 p-3 rounded-lg flex gap-3 text-error mt-4">
                           <ThumbsDown size={18} className="flex-none mt-0.5" />
                           <p className="text-xs">You rejected this mockup. A designer will upload a newly revised version shortly.</p>
                        </div>
                     )}
                  </div>

                  {/* Modal Actions */}
                  <div className="mt-8 space-y-3 pt-4 border-t border-base-200/60">
                     {selectedMockup.status === 'pending' && (
                        <>
                           <button onClick={() => { handleAction(selectedMockup.id, 'approved'); }} className="btn btn-success w-full uppercase tracking-wider font-bold">
                              <ThumbsUp size={16} className="-mt-0.5" /> Approve Design
                           </button>
                           <button onClick={() => { handleAction(selectedMockup.id, 'rejected'); }} className="btn btn-error btn-outline w-full uppercase tracking-wider font-bold">
                              <ThumbsDown size={16} className="-mt-0.5" /> Reject & Request Changes
                           </button>
                        </>
                     )}
                     {selectedMockup.status !== 'pending' && (
                        <button onClick={() => window.open(selectedMockup.url, '_blank')} className="btn btn-info w-full uppercase tracking-wider font-bold text-white">
                           <Download size={16} className="-mt-0.5" /> Download Full Res
                        </button>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
