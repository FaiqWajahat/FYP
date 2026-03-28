"use client";
import React, { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

export default function ChatApp({ isAdmin = false }) {
  // Dummy contacts Data
  // Admin sees multiple clients, User sees only one admin
  const allContacts = isAdmin ? [
    { id: 1, name: "Alice Smith", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d", role: "Customer", isOnline: true, lastSeen: "Now" },
    { id: 2, name: "Bob Johnson", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", role: "Customer", isOnline: false, lastSeen: "2 hours ago" },
    { id: 3, name: "Charlie Davis", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d", role: "Customer", isOnline: true, lastSeen: "Now" }
  ] : [
    { id: 'admin', name: "Store Admin", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100", role: "Support", isOnline: true, lastSeen: "Now" }
  ];

  const [contacts] = useState(allContacts);
  const [activeContact, setActiveContact] = useState(contacts[0]);

  // Dummy messages Data
  const [messages, setMessages] = useState([
    {
      id: 1,
      contactId: isAdmin ? 1 : 'admin',
      senderId: isAdmin ? 'admin' : 'admin', 
      text: "Hello! How can I help you today?",
      time: "10:24 AM",
      isMyMessage: !isAdmin // If user, the admin message is NOT their message. If admin, it IS their message.
    },
    {
      id: 2,
      contactId: isAdmin ? 1 : 'admin',
      senderId: isAdmin ? 1 : 'user123',
      text: isAdmin ? "I have a question about my order." : "I need help with my recent purchase.",
      time: "10:25 AM",
      isMyMessage: isAdmin ? false : true // If user, they sent it, so it IS theirs. If admin, they received it, so NOT theirs.
    }
  ]);

  const handleSendMessage = (text, file = null) => {
    const newMessage = {
      id: Date.now(),
      contactId: activeContact.id,
      senderId: isAdmin ? 'admin' : 'user123',
      text,
      file,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMyMessage: true,
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate real-time reply if communicating with admin
    if (!isAdmin) {
      setTimeout(() => {
        const replyMessage = {
          id: Date.now() + 1,
          contactId: 'admin',
          senderId: 'admin',
          text: "Thanks for reaching out! A representative will review your request shortly.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMyMessage: false,
        };
        setMessages(prev => [...prev, replyMessage]);
      }, 1500);
    }
  };

  const activeMessages = messages.filter(m => m.contactId === activeContact.id);

  return (
    <div className="flex h-[calc(100vh-140px)] w-full bg-base-100 shadow-xl border border-base-200 rounded-xl overflow-hidden">
      {isAdmin && (
        <ChatSidebar 
          contacts={contacts} 
          activeContact={activeContact} 
          onSelectContact={setActiveContact} 
          isAdmin={isAdmin} 
        />
      )}
      <ChatWindow 
        activeContact={activeContact} 
        messages={activeMessages} 
        onSendMessage={handleSendMessage} 
      />
    </div>
  );
}
