"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MoreVertical, FileText } from 'lucide-react';

export default function ChatWindow({ activeContact, messages, onSendMessage }) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onSendMessage("", file);
      e.target.value = ""; // reset
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderAvatar = (src, name, size = "w-8 md:w-10") => {
    const isPlaceholder = !src || src.includes('ui-avatars.com');

    if (!isPlaceholder) {
      return (
        <div className={`${size} rounded-full shadow-md border-2 border-base-100 ring-1 ring-base-content/5 overflow-hidden`}>
          <img src={src} alt={name} className="object-cover w-full h-full" />
        </div>
      );
    }

    return (
      <div className={`${size} rounded-full shadow-md border-2 border-base-100 ring-1 ring-base-content/5 bg-[var(--primary)] flex items-center justify-center text-primary-content text-[10px] font-black uppercase tracking-widest`}>
        {getInitials(name)}
      </div>
    );
  };

  if (!activeContact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-base-200 text-base-content/40">
        <div className="p-8 rounded-full bg-base-100 shadow-inner mb-4">
          <Paperclip className="w-12 h-12 opacity-20" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-base-200 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

      {/* Header */}
      <div className="h-16 border-b border-base-300 bg-base-100 flex items-center justify-between px-6 shadow-sm z-10">
        <div className="flex items-center">
          <div className="avatar indicator">
            <span className={`indicator-item badge badge-xs ${activeContact?.isOnline ? 'badge-success' : 'badge-neutral'} ring-2 ring-base-100 right-0 bottom-1 translate-x-0 translate-y-0`}></span>
            {renderAvatar(activeContact?.avatar, activeContact?.name)}
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-base-content text-sm leading-tight">{activeContact?.name}</h3>
            <p className="text-xs text-base-content/60 flex items-center gap-1">
              {activeContact?.isOnline ? (
                <><span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"></span> Online</>
              ) : (
                `Offline • Last seen ${activeContact?.lastSeen || 'recently'}`
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-base-content/60">

        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 z-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-base-content/20 [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-base-content/40 [&::-webkit-scrollbar-thumb]:rounded-full bg-base-200/50">
        {messages.map((msg, index) => {
          const isMyMsg = msg.isMyMessage;
          // Only show header (name/time) for the first message in a group
          const showHeader = index === 0 || messages[index - 1].isMyMessage !== isMyMsg;

          return (
            <div key={msg.id || index} className={`chat ${isMyMsg ? 'chat-end' : 'chat-start'} mb-2`}>
              <div className="chat-image avatar">
                {renderAvatar(isMyMsg ? msg.myAvatar : activeContact?.avatar, isMyMsg ? msg.myName : activeContact?.name)}
              </div>

              {showHeader && (
                <div className="chat-header opacity-60 text-[11px] mb-1 font-bold uppercase tracking-widest px-2">
                  {isMyMsg ? "You" : activeContact?.name}
                  <time className="text-[10px] ml-2 font-normal opacity-50">{msg.time}</time>
                </div>
              )}

              <div className={`chat-bubble min-h-0 py-2.5 px-4 shadow-md relative overflow-hidden group ${isMyMsg ? 'bg-[var(--primary)] text-white rounded-tr-none border border-white/10' : 'bg-base-100 text-base-content border border-base-300 rounded-tl-none'}`}>
                {/* Check if it's a file attachment */}
                {msg.file ? (
                  <div className="flex flex-col gap-2">
                    {msg.file.type?.startsWith('image/') ? (
                      <div className="relative group/img overflow-hidden rounded-xl bg-base-300 min-h-[100px] min-w-[200px]">
                        <img
                          src={msg.file.url}
                          alt="attachment"
                          className="max-h-[350px] w-auto max-w-full object-contain rounded-xl transition-all duration-500 group-hover/img:scale-[1.03] cursor-zoom-in"
                          onClick={() => window.open(msg.file.url, '_blank')}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent hover:from-black/10 transition-colors pointer-events-none" />
                      </div>
                    ) : (
                      <a
                        href={msg.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-4 p-3 rounded-2xl border transition-all no-underline ${isMyMsg ? 'bg-white/10 border-white/20 hover:bg-white/15' : 'bg-base-200 border-base-300 hover:bg-base-300'} group/file`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover/file:scale-110 shadow-sm ${isMyMsg ? 'bg-white/20' : 'bg-[var(--primary)]/10'}`}>
                          <FileText className={`w-6 h-6 ${isMyMsg ? 'text-white' : 'text-primary'}`} />
                        </div>
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className={`text-[13px] font-black truncate max-w-[160px] ${isMyMsg ? 'text-white' : 'text-base-content'}`}>{msg.text || 'Untitled File'}</span>
                          <span className={`text-[10px] uppercase font-black tracking-widest opacity-50 ${isMyMsg ? 'text-white' : 'text-base-content'}`}>
                            {msg.file.type?.split('/')[1] || 'FILE'} • Download
                          </span>
                        </div>
                      </a>
                    )}
                    {msg.text && (msg.text !== msg.file.name) && <p className="leading-relaxed leading-6 mt-1">{msg.text}</p>}
                  </div>
                ) : (
                  <p className="leading-relaxed leading-6">{msg.text}</p>
                )}
              </div>

              {/* Only show bottom status if last in group or mine */}
              <div className="chat-footer opacity-60 text-[10px] mt-1 flex items-center gap-1.5 min-h-[14px] px-1">
                {isMyMsg && (
                  msg.isSending ? (
                    <div className="flex items-center gap-1.5 text-primary font-black animate-pulse">
                      <span className="loading loading-spinner loading-[10px]"></span>
                      <span>SHIPPING...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 transition-all duration-700 animate-in fade-in zoom-in-75">
                      <div className="flex -space-x-1 items-center">
                        <span className="text-success font-black scale-110 drop-shadow-sm">✓</span>
                        <span className="text-success font-black scale-110 -ml-1 drop-shadow-sm">✓</span>
                      </div>
                      <span className="font-black uppercase tracking-tighter opacity-70">Handled</span>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-base-100 border-t border-base-300 z-10">
        <form onSubmit={handleSend} className="flex items-center gap-2">

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="*/*"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-base-content/60 hover:text-[var(--primary)] hover:bg-base-200 rounded-full transition-colors flex-shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="relative flex-1 group">
            <input
              type="text"
              placeholder="Write your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="input input-bordered w-full rounded-full bg-base-200 border-none focus:ring-1 focus:bg-base-100 transition-all duration-300 pl-4 pr-4 shadow-inner group-hover:bg-base-100 text-sm text-base-content"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 shadow-md ${inputText.trim() ? 'bg-[var(--primary)] text-white hover:shadow-lg hover:-translate-y-0.5 transform active:scale-95 cursor-pointer' : 'bg-base-300 text-base-content/40 cursor-not-allowed'}`}
          >
            <Send className="w-4 h-4" style={{ transform: 'translateX(-1px)' }} />
          </button>
        </form>
      </div>
    </div>
  );
}
