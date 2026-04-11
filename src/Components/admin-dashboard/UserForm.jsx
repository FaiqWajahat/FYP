'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User, Mail, Phone, MapPin,
  Shield, Save, Loader2, X, UserPlus, Fingerprint, Camera, Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
const UserForm = ({ initialData = null, isEdit = false, onSave }) => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'user',
    profile_image: '',
    shipping_address: {
      street: '',
      city: '',
      country: '',
      zip: ''
    },
    password: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        full_name: initialData.full_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        role: initialData.role || 'user',
        profile_image: initialData.profile_image || '',
        shipping_address: initialData.shipping_address || {
          street: '',
          city: '',
          country: '',
          zip: ''
        },
        password: ''
      });
    }
  }, [initialData]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }

    try {
      setUploading(true);

      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload image');

      setFormData({ ...formData, profile_image: data.url });
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
      toast.error(error.message || 'Failed to upload avatar.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, profile_image: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      router.refresh();
      router.push('/admin/Users/All');
    } catch (err) {
      toast.error(err.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-100 rounded-2xl border border-base-content/10 shadow-sm overflow-hidden min-h-[600px] flex flex-col md:flex-row">

      {/* Left Column: Comprehensive Form */}
      <div className="flex-1 p-6 md:p-8 space-y-10 border-b md:border-b-0 md:border-r border-base-content/10">

        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg uppercase tracking-widest flex items-center gap-3 text-base-content">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
              {isEdit ? <Save size={20} /> : <UserPlus size={20} />}
            </div>
            {isEdit ? "Edit User Account" : "Add New User Account"}
          </h3>
          <button onClick={() => router.back()} className="btn btn-ghost btn-sm btn-circle opacity-50 hover:opacity-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Avatar Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-base-content/5 pb-2">
              <Camera className="w-3.5 h-3.5 text-base-content/30" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">Profile Media</span>
            </div>

            <div className="flex items-center gap-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-base-200 border-2 border-dashed border-base-content/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-[var(--primary)]/40">
                  {formData.profile_image ? (
                    <img src={formData.profile_image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-base-content/20" />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-base-100/60 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute -bottom-2 -right-2 btn btn-[var(--primary)] btn-sm btn-circle shadow-lg"
                >
                  <Camera size={14} className="text-[var(--primary)]" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold">Account Picture</p>
                <p className="text-[10px] text-base-content/40 max-w-[200px]">Represent the user profile with a professional avatar. JPG/PNG, max 2MB.</p>
                <div className="flex gap-4 mt-3">
                  <button type="button" onClick={() => fileInputRef.current.click()} className="btn btn-xs btn-ghost text-[var(--primary)] lowercase tracking-tight">upload new</button>
                  {formData.profile_image && (
                    <button type="button" onClick={removeImage} className="btn btn-xs btn-ghost text-error lowercase tracking-tight">remove</button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          {/* Section 1: Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-base-content/5 pb-2">
              <Fingerprint className="w-3.5 h-3.5 text-base-content/30" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">Identity & Contact</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control w-full group">
                <label className="label py-1 mb-1">
                  <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-base-200 border border-base-content/10 text-base-content outline-none text-sm font-semibold transition-all duration-300 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4 focus:ring-[var(--primary)]/10"
                  placeholder="John Doe"
                />
              </div>

              <div className="form-control w-full group">
                <label className="label py-1 mb-1">
                  <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  disabled={isEdit}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-base-200 border border-base-content/10 text-base-content outline-none text-sm font-semibold transition-all duration-300 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4 focus:ring-[var(--primary)]/10 disabled:opacity-40"
                  placeholder="john@example.com"
                />
              </div>

              {!isEdit && (
                <div className="form-control w-full md:col-span-2 group">
                  <label className="label py-1 mb-1">
                    <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">Initial Password</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl bg-base-200 border border-base-content/10 text-base-content outline-none text-sm font-semibold transition-all duration-300 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4 focus:ring-[var(--primary)]/10"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <div className="form-control w-full md:col-span-2 group">
                <label className="label py-1 mb-1">
                  <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">Phone Number</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-base-200 border border-base-content/10 text-base-content outline-none text-sm font-semibold transition-all duration-300 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4 focus:ring-[var(--primary)]/10"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Logistics */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-base-content/5 pb-2">
              <MapPin className="w-3.5 h-3.5 text-base-content/30" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">Logistics & Shipping</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control w-full md:col-span-2 group">
                <label className="label py-1 mb-1">
                  <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">Street Address</span>
                </label>
                <input
                  type="text"
                  value={formData.shipping_address.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    shipping_address: { ...formData.shipping_address, street: e.target.value }
                  })}
                  className="w-full px-5 py-4 rounded-xl bg-base-200 border border-base-content/10 text-base-content outline-none text-sm font-semibold transition-all duration-300 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4 focus:ring-[var(--primary)]/10"
                  placeholder="123 Industrial Way"
                />
              </div>

              <div className="form-control w-full group">
                <label className="label py-1 mb-1">
                  <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">City</span>
                </label>
                <input
                  type="text"
                  value={formData.shipping_address.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    shipping_address: { ...formData.shipping_address, city: e.target.value }
                  })}
                  className="w-full px-5 py-4 rounded-xl bg-base-200 border border-base-content/10 text-base-content outline-none text-sm font-semibold transition-all duration-300 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4 focus:ring-[var(--primary)]/10"
                  placeholder="San Francisco"
                />
              </div>

              <div className="form-control w-full group">
                <label className="label py-1 mb-1">
                  <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">Country</span>
                </label>
                <input
                  type="text"
                  value={formData.shipping_address.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    shipping_address: { ...formData.shipping_address, country: e.target.value }
                  })}
                  className="w-full px-5 py-4 rounded-xl bg-base-200 border border-base-content/10 text-base-content outline-none text-sm font-semibold transition-all duration-300 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4 focus:ring-[var(--primary)]/10"
                  placeholder="USA"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Right Sidebar: Role Selection & Global Actions */}
      <div className="w-full md:w-[320px] lg:w-[360px] p-6 md:p-8 bg-base-200/30 flex flex-col gap-8">

        <div className="space-y-6">
          <label className="label py-1 mb-1">
            <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 tracking-[0.2em]">Administrative Permissions</span>
          </label>

          <div className="flex flex-col gap-4">
            {[
              { id: 'user', label: 'Factory User', icon: User, desc: 'Places orders & views history' },
              { id: 'admin', label: 'Administrator', icon: Shield, desc: 'Full system management access' }
            ].map((roleOption) => (
              <button
                key={roleOption.id}
                type="button"
                onClick={() => setFormData({ ...formData, role: roleOption.id })}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-500 relative overflow-hidden group ${formData.role === roleOption.id
                  ? 'border-[var(--primary)] bg-base-100 shadow-xl shadow-[var(--primary)]/5'
                  : 'border-base-content/5 bg-base-100/50 hover:border-base-content/10'
                  }`}
              >
                {formData.role === roleOption.id && (
                  <div className="absolute top-0 right-0 p-2 text-[var(--primary)]">
                    <Shield size={14} fill="currentColor   " className="opacity-10" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${formData.role === roleOption.id ? 'bg-[var(--primary)] text-[var(--primary)]-content' : 'bg-base-300 text-base-content/30'}`}>
                    <roleOption.icon size={16} />
                  </div>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest ${formData.role === roleOption.id ? 'text-base-content' : 'text-base-content/40'}`}>
                      {roleOption.label}
                    </p>
                    <p className="text-[9px] font-medium text-base-content/40 mt-0.5 leading-tight">{roleOption.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto space-y-4 pt-8 border-t border-base-content/5">
          <button
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="w-full btn bg-[var(--primary)] text-white h-14 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] gap-3 shadow-xl shadow-[var(--primary)]/30 disabled:opacity-50 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 text-[var(--primary)]-content" /> : (isEdit ? <Save size={18} /> : <UserPlus size={18} />)}
            {isEdit ? "Update account" : "Initialize User"}
          </button>
          <button
            onClick={() => router.back()}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 hover:text-base-content transition-colors"
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
