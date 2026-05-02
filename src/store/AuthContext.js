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

    // 1. Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        if (currentUser.is_anonymous) {
          localStorage.setItem('factory_flow_anon_id', currentUser.id);
        } else {
          await mergeGuestChat(currentUser);
        }
        fetchProfile(currentUser.id);
      } else {
        setLoading(false);
      }
    };

    getSession();

    // 2. Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        if (currentUser.is_anonymous) {
          localStorage.setItem('factory_flow_anon_id', currentUser.id);
        } else {
          await mergeGuestChat(currentUser);
        }
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn("Could not fetch profile, might not exist yet:", error.message);
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
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
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
    <AuthContext.Provider value={{ user, profile, loading, signOut, signInWithGoogle, refreshProfile: () => fetchProfile(user?.id) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
