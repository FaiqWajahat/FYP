'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mergeGuestChat = async (currentUser) => {
      const anonId = localStorage.getItem('factory_flow_anon_id');
      // Only merge if we have a saved anonId AND the current user is a REAL (permanent) user
      if (anonId && currentUser && !currentUser.is_anonymous) {
        try {
          await fetch('/api/chat/merge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ anonId })
          });
          localStorage.removeItem('factory_flow_anon_id');
        } catch (e) {
          console.error('Failed to merge anonymous chat', e);
        }
      }
    };

    // 1. Listen for changes on auth state (logged in, signed out, etc.)
    // Note: onAuthStateChange automatically fires the initial session status (INITIAL_SESSION) immediately on subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        if (currentUser.is_anonymous) {
          localStorage.setItem('factory_flow_anon_id', currentUser.id);
        } else {
          await mergeGuestChat(currentUser);
        }
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (currentUser, retryCount = 0) => {
    if (!currentUser) return;
    const userId = currentUser.id;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn(`[AuthContext] Profile fetch failed (attempt ${retryCount + 1}):`, error.message);
        
        // Provide immediate fallback from session metadata to prevent blank navbar
        if (currentUser) {
          setProfile({
            id: currentUser.id,
            email: currentUser.email,
            full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
            role: 'user',
            profile_image: '',
            is_fallback: true
          });
        }

        // Retry up to 3 times (with 1.5s delay) to catch database triggers creating the profile row
        if (retryCount < 3) {
          setTimeout(() => fetchProfile(currentUser, retryCount + 1), 1500);
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase auth signout error (proceeding with local state clear):", err.message);
    }
    setUser(null);
    setProfile(null);
    // Perform full reload-redirect to clear all client caching/state and reroute public pages
    window.location.href = '/';
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback'
      }
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, signInWithGoogle, refreshProfile: () => fetchProfile(user) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
