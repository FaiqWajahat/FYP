"use client";
import React, { useState } from 'react';
import { Truck, MapPin, Package, Hash, Save, AlertCircle, Globe, Ship } from 'lucide-react';
import toast from 'react-hot-toast';

const SHIPPING_METHODS = [
  { id: 'FOB', name: 'FOB (Free On Board)', desc: 'Client pays shipping from port' },
  { id: 'CIF', name: 'CIF (Cost, Insurance & Freight)', desc: 'Factory ships to client port' },
  { id: 'DAP', name: 'DAP (Delivered At Place)', desc: 'Door-to-door delivery' },
  { id: 'EXW', name: 'EXW (Ex Works)', desc: 'Client picks up from factory' },
];

export default function AdminShippingDetails({ order, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_method: order.shipping_method || 'FOB',
    shipping_carrier: order.shipping_carrier || '',
    shipping_tracking_number: order.shipping_tracking_number || '',
    shipping_status: order.shipping_status || 'Pending',
    shipping_address: order.shipping_address || {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: order.id,
          ...formData
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Shipping details updated");
        setIsEditing(false);
        if (onUpdate) onUpdate();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      shipping_address: {
        ...prev.shipping_address,
        [name]: value
      }
    }));
  };

  return (
    <div className="bg-white rounded-3xl border border-base-200 overflow-hidden shadow-sm font-sans h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-base-200 bg-base-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] border border-[var(--primary)]/20 shadow-sm">
            <Truck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-base-content leading-none">Shipping & Logistics</h3>
            <p className="text-[10px] text-base-content/40 mt-1 uppercase tracking-widest font-bold">Manage delivery & tracking</p>
          </div>
        </div>
        
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={loading}
          className={`btn btn-sm h-9 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 transition-all ${
            isEditing 
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-none' 
            : 'bg-white border-base-200 text-base-content hover:bg-base-100'
          }`}
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : isEditing ? (
            <><Save size={14} /> Save Changes</>
          ) : (
            'Edit Details'
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
        
        {/* Row 1: Method & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 flex items-center gap-2">
              <Ship size={14} className="text-[var(--primary)]" /> Shipping Method
            </label>
            {isEditing ? (
              <select 
                value={formData.shipping_method}
                onChange={(e) => setFormData({...formData, shipping_method: e.target.value})}
                className="select select-bordered w-full rounded-xl text-sm font-bold focus:ring-2 focus:ring-[var(--primary)]/20"
              >
                {SHIPPING_METHODS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            ) : (
              <div className="p-4 bg-base-50 rounded-2xl border border-base-200">
                <p className="text-sm font-bold text-base-content">
                  {SHIPPING_METHODS.find(m => m.id === formData.shipping_method)?.name || formData.shipping_method}
                </p>
                <p className="text-[10px] text-base-content/40 mt-1 font-medium">
                  {SHIPPING_METHODS.find(m => m.id === formData.shipping_method)?.desc}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 flex items-center gap-2">
              <Package size={14} className="text-[var(--primary)]" /> Logistics Status
            </label>
            {isEditing ? (
              <select 
                value={formData.shipping_status}
                onChange={(e) => setFormData({...formData, shipping_status: e.target.value})}
                className="select select-bordered w-full rounded-xl text-sm font-bold focus:ring-2 focus:ring-[var(--primary)]/20"
              >
                <option value="Pending">Pending</option>
                <option value="Packaging">Packaging</option>
                <option value="Ready for Pickup">Ready for Pickup</option>
                <option value="Dispatched">Dispatched</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            ) : (
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                formData.shipping_status === 'Delivered' 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                : 'bg-amber-50 border-amber-100 text-amber-700'
              }`}>
                <span className="text-sm font-black uppercase tracking-widest">{formData.shipping_status}</span>
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  formData.shipping_status === 'Delivered' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Carrier & Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 flex items-center gap-2">
              <Globe size={14} className="text-[var(--primary)]" /> Shipping Carrier
            </label>
            {isEditing ? (
              <input 
                type="text"
                value={formData.shipping_carrier}
                onChange={(e) => setFormData({...formData, shipping_carrier: e.target.value})}
                placeholder="e.g. DHL, FedEx, UPS"
                className="input input-bordered w-full rounded-xl text-sm font-bold focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            ) : (
              <div className="p-4 bg-white rounded-2xl border border-base-200 shadow-sm flex items-center gap-3">
                <Globe size={16} className="text-base-content/20" />
                <p className="text-sm font-bold text-base-content">{formData.shipping_carrier || 'Not Assigned'}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 flex items-center gap-2">
              <Hash size={14} className="text-[var(--primary)]" /> Tracking Number
            </label>
            {isEditing ? (
              <input 
                type="text"
                value={formData.shipping_tracking_number}
                onChange={(e) => setFormData({...formData, shipping_tracking_number: e.target.value})}
                placeholder="Enter tracking ID"
                className="input input-bordered w-full rounded-xl text-sm font-bold focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            ) : (
              <div className="p-4 bg-white rounded-2xl border border-base-200 shadow-sm flex items-center gap-3">
                <Hash size={16} className="text-base-content/20" />
                <p className="text-sm font-mono font-bold text-[var(--primary)]">
                  {formData.shipping_tracking_number || 'Awaiting Dispatch'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Shipping Address */}
        <div className="space-y-6 pt-6 border-t border-base-100">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 flex items-center gap-2">
            <MapPin size={14} className="text-[var(--primary)]" /> Destination Address
          </h4>
          
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[9px] font-bold text-base-content/40 uppercase mb-1 block">Street Address</label>
                <input 
                  name="street"
                  value={formData.shipping_address.street}
                  onChange={handleAddressChange}
                  className="input input-bordered w-full rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-base-content/40 uppercase mb-1 block">City</label>
                <input 
                  name="city"
                  value={formData.shipping_address.city}
                  onChange={handleAddressChange}
                  className="input input-bordered w-full rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-base-content/40 uppercase mb-1 block">State / Province</label>
                <input 
                  name="state"
                  value={formData.shipping_address.state}
                  onChange={handleAddressChange}
                  className="input input-bordered w-full rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-base-content/40 uppercase mb-1 block">ZIP / Postal Code</label>
                <input 
                  name="zip"
                  value={formData.shipping_address.zip}
                  onChange={handleAddressChange}
                  className="input input-bordered w-full rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-base-content/40 uppercase mb-1 block">Country</label>
                <input 
                  name="country"
                  value={formData.shipping_address.country}
                  onChange={handleAddressChange}
                  className="input input-bordered w-full rounded-xl text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="bg-base-50 rounded-2xl p-6 border border-base-200 relative overflow-hidden group">
               <MapPin size={40} className="absolute -right-4 -bottom-4 text-base-content/5 group-hover:text-base-content/10 transition-colors" />
               {formData.shipping_address?.street ? (
                 <div className="space-y-1 relative z-10">
                   <p className="text-sm font-bold text-base-content">{formData.shipping_address.street}</p>
                   <p className="text-sm font-medium text-base-content/60">
                     {formData.shipping_address.city}, {formData.shipping_address.state} {formData.shipping_address.zip}
                   </p>
                   <p className="text-sm font-black text-base-content uppercase tracking-widest pt-2">
                     {formData.shipping_address.country}
                   </p>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-4 text-center">
                    <AlertCircle size={24} className="text-base-content/20 mb-2" />
                    <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest">No address provided</p>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="p-4 bg-base-50/50 border-t border-base-200 text-center">
        <p className="text-[9px] font-bold text-base-content/30 uppercase tracking-widest">
          Last updated: {new Date(order.updated_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
