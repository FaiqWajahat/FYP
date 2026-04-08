import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function PersonalInformationForm({ profile, user, refreshProfile, targetUserId, showRoleSelector, onSuccess }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    role: 'user',
  });

  const effectiveUserId = targetUserId || user?.id;

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        role: profile.role || 'user',
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updateData = {
        full_name: formData.full_name,
        phone: formData.phone,
        updated_at: new Date().toISOString(),
      };

      if (showRoleSelector) {
        updateData.role = formData.role;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', effectiveUserId);

      if (error) throw error;

      toast.success('Information updated successfully!');

      if (onSuccess) {
        onSuccess();
      } else if (refreshProfile) {
        refreshProfile();
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update information');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-base-100 rounded-3xl shadow-xl shadow-black/5 border border-base-200 overflow-hidden font-sans">
      <div className="px-8 py-6 border-b border-base-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[var(--primary)]/10 rounded-2xl">
            <User size={22} className="text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="font-black text-base-content uppercase tracking-widest text-sm">Personal Information</h3>
            <p className="text-[10px] text-base-content/50 font-bold uppercase tracking-widest mt-0.5">Manage core account details</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text text-[10px] font-black uppercase tracking-widest text-base-content/60 ml-1">Full Name</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  className="input input-bordered w-full pl-12 h-14 bg-base-200/50 border-transparent focus:bg-base-100 focus:border-[var(--primary)] focus:ring-[var(--primary)]/20 rounded-2xl transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="form-control w-full opacity-60 pointer-events-none">
              <label className="label py-1">
                <span className="label-text text-[10px] font-black uppercase tracking-widest text-base-content/60 ml-1">Email Address (Read-only)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="input input-bordered w-full pl-12 h-14 bg-base-200 border-transparent rounded-2xl font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text text-[10px] font-black uppercase tracking-widest text-base-content/60 ml-1">Phone Number</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input input-bordered w-full pl-12 h-14 bg-base-200/50 border-transparent focus:bg-base-100 focus:border-[var(--primary)] focus:ring-[var(--primary)]/20 rounded-2xl transition-all font-medium"
                  placeholder="+92 3XX XXXXXXX"
                />
              </div>
            </div>
          </div>

          {showRoleSelector && (
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text text-[10px] font-black uppercase tracking-widest text-base-content/60 ml-1">Account Role (Admin Only)</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="select select-bordered w-full h-14 bg-base-200/50 border-transparent focus:bg-base-100 focus:border-[var(--primary)] focus:ring-[var(--primary)]/20 rounded-2xl transition-all font-medium"
              >
                <option value="user">User / Customer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="btn bg-[var(--primary)] text-white h-14 px-10 rounded-xl  shadow-sm shadow-[var(--primary)]/20 font-black uppercase tracking-widest text-xs gap-3"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
