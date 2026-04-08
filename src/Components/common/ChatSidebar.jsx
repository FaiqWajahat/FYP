"use client";
import React from 'react';
import { Search } from 'lucide-react';

export default function ChatSidebar({ contacts, activeContact, onSelectContact, isAdmin }) {
  return (
    <div className="w-1/3 md:w-1/4 border-r border-base-200 flex flex-col bg-base-100">
      {/* Search Header */}
      <div className="p-4 border-b border-base-200">
        <h2 className="text-xl font-bold mb-3">{isAdmin ? "Conversations" : "User Chat"}</h2>
        {isAdmin && (
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-base-content/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="input input-sm w-full pl-9 rounded-full bg-base-200 border-none focus:ring-1  focus:bg-base-100 transition-all"
            />
          </div>
        )}
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-base-content/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-base-content/40">
        <ul className="p-2 space-y-1">
          {contacts.map((contact) => (
            <li key={contact.id}>
              <button
                onClick={() => onSelectContact(contact)}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 text-left cursor-pointer ${activeContact.id === contact.id ? 'bg-base-200 shadow-sm border-l-4 border-[var(--primary)] rounded-l-none' : 'hover:bg-base-200/50 border-l-4 border-transparent'}`}
              >
                <div className="avatar indicator">
                  <span className={`indicator-item badge badge-xs ${contact.isOnline ? 'badge-success' : 'badge-neutral border border-base-100'} ring-2 ring-base-100 right-1 bottom-1 translate-x-0 translate-y-0 shadow-sm`}></span>
                  <div className="w-10 h-10 rounded-full">
                    <img src={contact.avatar} alt={contact.name} className="object-cover" />
                  </div>
                </div>

                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-semibold text-sm truncate uppercase tracking-tight">{contact.name}</span>
                    <span className="text-[9px] text-base-content/40 whitespace-nowrap ml-2 font-medium">{contact.lastSeen}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-base-content/60 block truncate max-w-[120px]">{contact.lastMessage || 'No messages yet'}</span>
                    {!contact.isOnline && <span className="text-[9px] text-base-content/30 italic">Offline</span>}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
