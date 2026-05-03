"use client";
import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Save, Edit3, Ship, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SHIPPING_METHODS = [
  { id: 'FOB', name: 'FOB (Free On Board)', desc: 'You pay shipping from port' },
  { id: 'CIF', name: 'CIF (Cost, Insurance & Freight)', desc: 'We ship to your port' },
  { id: 'DAP', name: 'DAP (Delivered At Place)', desc: 'Door-to-door delivery' },
  { id: 'EXW', name: 'EXW (Ex Works)', desc: 'Pickup from factory' },
];

export default function UserShippingPreference({ order, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_method: order.shipping_method || 'FOB',
    shipping_address: order.shipping_address || {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });

  const isLocked = ['Dispatched', 'In Transit', 'Delivered'].includes(order.shipping_status);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: order.id,
          ...formData
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Shipping preferences saved");
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
    <div className="bg-white rounded-3xl p-8 border border-base-200 shadow-sm space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-base-content tracking-tight">Shipping Preferences</h3>
            <p className="text-xs font-bold text-base-content/30 uppercase tracking-widest">Select method & destination</p>
          </div>
        </div>
        
        {!isLocked && (
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={loading}
            className={`btn btn-sm h-10 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 transition-all ${
              isEditing 
              ? 'bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-200' 
              : 'bg-base-50 border-base-200 text-base-content hover:bg-base-100'
            }`}
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : isEditing ? (
              <><Save size={14} /> Save Changes</>
            ) : (
              <><Edit3 size={14} /> Edit Preference</>
            )}
          </button>
        )}
      </div>

      {isLocked && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
          <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-[10px] font-bold text-amber-700 uppercase tracking-tight leading-none">
            Shipping details are locked as the order is already in the dispatch pipeline.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Method Selection */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content/30 flex items-center gap-2">
            <Ship size={14} className="text-blue-500" /> Choose Method
          </h4>
          
          <div className="grid grid-cols-1 gap-3">
            {SHIPPING_METHODS.map((method) => (
              <button
                key={method.id}
                disabled={!isEditing}
                onClick={() => setFormData({ ...formData, shipping_method: method.id })}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left ${
                  formData.shipping_method === method.id
                    ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100'
                    : 'bg-white border-base-100 hover:border-base-200'
                } ${!isEditing ? 'cursor-default' : 'cursor-pointer hover:scale-[1.02]'}`}
              >
                <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  formData.shipping_method === method.id ? 'border-blue-500 bg-blue-500' : 'border-base-300'
                }`}>
                  {formData.shipping_method === method.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-base-content">{method.name}</p>
                  <p className="text-[10px] text-base-content/40 font-medium">{method.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Address Entry */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content/30 flex items-center gap-2">
            <MapPin size={14} className="text-blue-500" /> Delivery Address
          </h4>

          {isEditing ? (
            <div className="grid grid-cols-1 gap-3">
              <input 
                name="street"
                placeholder="Street Address"
                value={formData.shipping_address.street}
                onChange={handleAddressChange}
                className="input input-bordered w-full rounded-xl text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  name="city"
                  placeholder="City"
                  value={formData.shipping_address.city}
                  onChange={handleAddressChange}
                  className="input input-bordered w-full rounded-xl text-sm"
                />
                <input 
                  name="state"
                  placeholder="State/Province"
                  value={formData.shipping_address.state}
                  onChange={handleAddressChange}
                  className="input input-bordered w-full rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  name="zip"
                  placeholder="ZIP / Postal Code"
                  value={formData.shipping_address.zip}
                  onChange={handleAddressChange}
                  className="input input-bordered w-full rounded-xl text-sm"
                />
                <input 
                  name="country"
                  placeholder="Country"
                  value={formData.shipping_address.country}
                  onChange={handleAddressChange}
                  className="input input-bordered w-full rounded-xl text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="bg-base-50 rounded-2xl p-6 border border-base-100 flex flex-col gap-1 min-h-[160px] justify-center">
              {formData.shipping_address.street ? (
                <>
                  <p className="text-sm font-bold text-base-content">{formData.shipping_address.street}</p>
                  <p className="text-sm font-medium text-base-content/60">
                    {formData.shipping_address.city}, {formData.shipping_address.state} {formData.shipping_address.zip}
                  </p>
                  <p className="text-sm font-black text-base-content uppercase tracking-widest pt-2">
                    {formData.shipping_address.country}
                  </p>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <MapPin size={24} className="mx-auto text-base-content/10" />
                  <p className="text-xs font-bold text-base-content/30 uppercase tracking-widest">No address saved</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
