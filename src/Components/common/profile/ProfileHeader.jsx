import React, { useState, useRef } from 'react';
import { Camera, MapPin, Building2, UserCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function ProfileHeader({ profile, user, refreshProfile, targetUserId, onSuccess }) {
  const [isUploading, setIsUploading] = useState({ profile: false, background: false });
  const profileInputRef = useRef(null);
  const backgroundInputRef = useRef(null);
  
  const effectiveUserId = targetUserId || user?.id;

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size should be less than 5MB');
      return;
    }

    setIsUploading(prev => ({ ...prev, [type]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const column = type === 'profile' ? 'profile_image' : 'background_image';
        
        const { error } = await supabase
          .from('profiles')
          .update({ [column]: result.url, updated_at: new Date().toISOString() })
          .eq('id', effectiveUserId);

        if (error) throw error;

        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} image updated!`);
        
        if (onSuccess) {
          onSuccess();
        } else if (refreshProfile) {
          refreshProfile();
        }
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${type} image`);
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="relative w-full bg-base-100 rounded-3xl shadow-xl shadow-black/5 border border-base-200 overflow-hidden font-sans mb-8">
      {/* Banner Area */}
      <div className="h-40 md:h-60 w-full relative group">
        {profile?.background_image ? (
          <img 
            src={profile.background_image} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/60"></div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
        
        <input 
          type="file" 
          ref={backgroundInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'background')}
        />
        
        <button 
          onClick={() => backgroundInputRef.current.click()}
          disabled={isUploading.background}
          className="absolute top-4 right-4 md:top-6 md:right-6 btn btn-sm btn-ghost bg-black/40 text-white hover:bg-black/60 border-none backdrop-blur-md shadow-md"
        >
          {isUploading.background ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Camera size={16} className="mr-1" />
          )}
          <span className="hidden sm:inline">{isUploading.background ? 'Uploading...' : 'Edit Cover'}</span>
        </button>
      </div>

      {/* Profile Details Area */}
      <div className="px-6 sm:px-8 md:px-12 pb-8 md:pb-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 md:gap-8 -mt-20 md:-mt-24 relative z-10 w-full">
        
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full md:w-auto">
           {/* Avatar */}
           <div className="relative shrink-0 group">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl ring-8 ring-base-100 shadow-2xl bg-base-200 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-[1.02] duration-300">
                {profile?.profile_image ? (
                  <img src={profile.profile_image} alt={profile.full_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl md:text-6xl font-black text-[var(--primary)] tracking-tighter">
                    {getInitials(profile?.full_name)}
                  </span>
                )}
              </div>
              
              <input 
                type="file" 
                ref={profileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'profile')}
              />

              <button 
                onClick={() => profileInputRef.current.click()}
                disabled={isUploading.profile}
                className="absolute bottom-2 right-2 btn btn-circle btn-md bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 border-none shadow-lg ring-4 ring-base-100"
              >
                {isUploading.profile ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
              </button>
           </div>

           {/* Text Details */}
           <div className="text-center md:text-left mb-2 w-full md:w-auto">
              <div className="flex flex-col md:flex-row items-center md:items-center gap-3">
                <h2 className="text-3xl md:text-4xl font-black text-base-content tracking-tight">{profile?.full_name || 'Set Your Name'}</h2>
                <span className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-black uppercase tracking-widest rounded-full border border-[var(--primary)]/20">
                  {profile?.role || 'Customer'}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 mt-3 text-sm text-base-content/60 font-semibold">
                 <span className="flex items-center gap-2 whitespace-nowrap">
                    <UserCircle2 size={18} className="text-[var(--primary)] shrink-0" /> 
                    {user?.email}
                 </span>
                 {profile?.shipping_address?.city && (
                    <>
                      <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-base-content/20"></span>
                      <span className="flex items-center gap-2 whitespace-nowrap">
                         <MapPin size={18} className="text-[var(--primary)] shrink-0" /> 
                         {profile.shipping_address.city}, {profile.shipping_address.country}
                      </span>
                    </>
                 )}
              </div>
           </div>
        </div>

        {/* Quick Info / Join Date */}
        <div className="hidden lg:flex flex-col items-end gap-1 text-right mb-2">
           <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40">Member Since</p>
           <p className="text-sm font-bold text-base-content/80">
             {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Join Date Unknown'}
           </p>
        </div>

      </div>
    </div>
  );
}
