"use client";
import React, { useState, useEffect, useCallback } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/store/AuthContext';
import { toast } from 'react-hot-toast';
import Loader2 from 'lucide-react';
import Loader from './Loader';

export default function ChatApp({ isAdmin = false }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Fetch a default admin profile for the "Support Admin" identity
    const fetchAdminProfile = async () => {
      if (!isAdmin) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, profile_image')
          .eq('role', 'admin')
          .limit(1)
          .single();
        
        if (!error && data) {
          setAdminProfile(data);
        }
      }
    };

    // Fetch current user's profile for "Me" identity
    const fetchCurrentProfile = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, profile_image')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setCurrentProfile(data);
        }
      }
    };
    
    fetchAdminProfile();
    fetchCurrentProfile();
  }, [isAdmin, user?.id]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      // Use a simpler join that is less dependent on specific constraint names
      let query = supabase
        .from('conversations')
        .select(`
          *,
          user:profiles (id, full_name, profile_image, role)
        `)
        .order('updated_at', { ascending: false });

      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        // If the fancy join fails, try a simple select as fallback
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('conversations')
          .select('*')
          .eq(isAdmin ? 'admin_id' : 'user_id', user.id)
          .order('updated_at', { ascending: false });
        
        if (fallbackError) throw fallbackError;
        setConversations(fallbackData || []);
      } else {
        // Handle case where User doesn't have a conversation yet
        if (!isAdmin && data.length === 0) {
          const { data: newConv, error: createError } = await supabase
            .from('conversations')
            .insert({ user_id: user.id })
            .select(`
              *,
              user:profiles (id, full_name, profile_image, role)
            `)
            .single();
          
          if (createError) throw createError;
          setConversations([newConv]);
          setActiveConversation(newConv);
        } else {
          setConversations(data);
          if (!activeConversation && data.length > 0) {
            setActiveConversation(data[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin, activeConversation]);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (convId) => {
    if (!convId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [user, isAdmin]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);

      // Subscribe to real-time messages for THIS conversation
      const channel = supabase
        .channel(`chat:${activeConversation.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${activeConversation.id}`,
          },
          (payload) => {
            const newMessage = payload.new;
            setMessages((prev) => {
              // Avoid duplicates from real-time if we already added it optimistically/locally
              if (prev.some(m => m.id === newMessage.id)) return prev;
              return [...prev, {
                ...newMessage,
                isMyMessage: newMessage.sender_id === user.id,
                time: new Date(newMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                file: newMessage.file_url ? { url: newMessage.file_url, type: newMessage.file_type } : null
              }];
            });
            
            // Update the sidebar last message preview in real-time
            setConversations(prev => 
              prev.map(c => c.id === activeConversation.id ? { 
                ...c, 
                last_message: newMessage.content || 'Sent an attachment',
                updated_at: newMessage.created_at 
              } : c)
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeConversation, fetchMessages]);

  const handleSendMessage = async (text, file = null) => {
    if (!activeConversation || !user) return;

    // 1. Create an Optimistic Message for Instant Display
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      conversation_id: activeConversation.id,
      sender_id: user.id,
      content: text || (file ? file.name : ""),
      file_url: file ? URL.createObjectURL(file) : null,
      file_type: file ? file.type : null,
      created_at: new Date().toISOString(),
      isMyMessage: true,
      isSending: true, // Internal flag for UI state
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      file: file ? { url: URL.createObjectURL(file), type: file.type, name: file.name } : null
    };

    // Update local UI immediately
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      let fileUrl = null;
      let fileType = null;

      // 2. Background Cloudinary Upload
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadRes.json();
        if (uploadResult.success) {
          fileUrl = uploadResult.url;
          fileType = file.type;
        } else {
          throw new Error('File upload failed');
        }
      }

      const messageContent = text || (file ? file.name : "");

      // 3. Background Supabase INSERT
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: activeConversation.id,
          sender_id: user.id,
          content: messageContent,
          file_url: fileUrl,
          file_type: fileType,
        })
        .select()
        .single();

      if (error) throw error;
      
      // 4. Update the Optimistic Message with Real Data
      // By replacing the temp entry with the real database entry
      setMessages(prev => prev.map(m => m.id === tempId ? {
        ...data,
        isMyMessage: true,
        isSending: false,
        time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        file: data.file_url ? { url: data.file_url, type: data.file_type } : null
      } : m));

      // Update local conversation list for sidebar preview
      setConversations(prev => 
         prev.map(c => c.id === activeConversation.id ? { ...c, last_message: messageContent || 'Sent a file' } : c)
      );

    } catch (error) {
      console.error('Send error:', error);
      toast.error('Failed to send message');
      // Mark as failed in UI if you want, or just remove
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  if (!isMounted || loading) {
     return (
       <div className="flex items-center justify-center h-[400px] w-full bg-base-100 rounded-xl border border-base-200 shadow-sm">
          <Loader variant="inline" message="Syncing secure conversations..." />
       </div>
     );
  }

  // Handle case where user is not logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] w-full bg-base-100 rounded-xl border border-dashed border-base-300 p-8 text-center">
        <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-base-content/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h3 className="text-lg font-bold mb-2 uppercase tracking-tight">Authentication Required</h3>
        <p className="text-sm text-base-content/60 mb-6 max-w-xs">Please sign in to your account to access real-time messaging and support.</p>
        <button onClick={() => window.location.href = '/login'} className="btn btn-primary btn-sm rounded-full px-8">
          Go to Login
        </button>
      </div>
    );
  }

  const sidebarContacts = conversations.map(conv => ({
    id: conv.id,
    name: isAdmin ? (conv.user?.full_name || 'Anonymous User') : 'Factory Flow Support',
    avatar: isAdmin ? (conv.user?.profile_image || `https://ui-avatars.com/api/?name=${conv.user?.full_name || 'U'}&background=random`) : `https://ui-avatars.com/api/?name=Factory+Flow&background=0066FF&color=fff&bold=true`,
    role: isAdmin ? (conv.user?.role || 'Customer') : 'Support',
    isOnline: true, // Simplified for now
    lastSeen: new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    lastMessage: conv.last_message
  }));

  const activeContact = sidebarContacts.find(c => c.id === activeConversation?.id) || sidebarContacts[0];

  return (
    <div className="flex h-[calc(100vh-140px)] w-full bg-base-100 shadow-xl border border-base-200 rounded-xl overflow-hidden font-sans">
      {isAdmin && (
        <ChatSidebar 
          contacts={sidebarContacts} 
          activeContact={activeContact} 
          onSelectContact={(contact) => {
            const conv = conversations.find(c => c.id === contact.id);
            setActiveConversation(conv);
          }} 
          isAdmin={isAdmin} 
        />
      )}
      <ChatWindow 
        activeContact={activeContact} 
        messages={messages.map(m => ({
          ...m,
          text: m.content,
          isMyMessage: m.sender_id === user.id,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          file: m.file_url ? { url: m.file_url, type: m.file_type } : null,
          myAvatar: currentProfile?.profile_image,
          myName: currentProfile?.full_name || 'Me'
        }))} 
        onSendMessage={handleSendMessage} 
      />
    </div>
  );
}
