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
      // Simulate reading and sending a file
      // If it's an image, we can show a preview. Otherwise just the name.
      const isImage = file.type.startsWith('image/');
      const filePayload = {
        name: file.name,
        type: file.type,
        url: isImage ? URL.createObjectURL(file) : null
      };

      onSendMessage("", filePayload);
      e.target.value = ""; // reset
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-base-200 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

      {/* Header */}
      <div className="h-16 border-b border-base-300 bg-base-100 flex items-center justify-between px-6 shadow-sm z-10">
        <div className="flex items-center">
          <div className="avatar indicator">
            <span className={`indicator-item badge badge-xs ${activeContact.isOnline ? 'badge-success' : 'badge-neutral'} ring-2 ring-base-100 right-0 bottom-1 translate-x-0 translate-y-0`}></span>
            <div className="w-10 h-10 rounded-full">
              <img src={activeContact.avatar} alt={activeContact.name} />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-base-content text-sm leading-tight">{activeContact.name}</h3>
            <p className="text-xs text-base-content/60 flex items-center gap-1">
              {activeContact.isOnline ? (
                <><span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"></span> Online</>
              ) : (
                `Offline • Last seen ${activeContact.lastSeen}`
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-base-content/60">

        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 z-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-base-content/20 [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-base-content/40 [&::-webkit-scrollbar-thumb]:rounded-full">
        {messages.map((msg, index) => {
          const isMyMsg = msg.isMyMessage;
          const showHeader = index === 0 || messages[index - 1].isMyMessage !== isMyMsg;

          return (
            <div key={msg.id || index} className={`chat ${isMyMsg ? 'chat-end' : 'chat-start'} ${showHeader ? 'mt-4' : 'mt-1'}`}>
              <div className="chat-image avatar">
                {showHeader ? (
                  <div className="w-8 md:w-10 rounded-full shadow-sm">
                    <img
                      alt={isMyMsg ? "Me" : activeContact.name}
                      src={isMyMsg ? "https://ui-avatars.com/api/?name=Me&background=random" : activeContact.avatar}
                    />
                  </div>
                ) : (
                  <div className="w-8 md:w-10"></div>
                )}
              </div>

              {showHeader && (
                <div className="chat-header opacity-50 text-xs mb-1 ml-1 mr-1">
                  {isMyMsg ? "You" : activeContact.name}
                  <time className="text-[10px] ml-2 font-light">{msg.time}</time>
                </div>
              )}

              {/* Message Bubble Structure */}
              <div className={`chat-bubble text-sm shadow-sm ${isMyMsg ? 'bg-[var(--primary)] text-white font-medium' : 'bg-base-100 text-base-content border border-base-300'} ${!showHeader && (isMyMsg ? 'rounded-tr-md' : 'rounded-tl-md')}`}>
                {/* Check if it's a file attachment */}
                {msg.file ? (
                  <div className="flex flex-col gap-2">
                    {msg.file.url ? (
                      <img src={msg.file.url} alt="attachment preview" className="max-w-[200px] rounded-lg border border-opacity-10 border-base-100" />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-base-content/10 rounded-md">
                        <FileText className="w-6 h-6 text-base-content/70" />
                        <span className="text-xs truncate max-w-[150px] text-base-content">{msg.file.name}</span>
                      </div>
                    )}
                    {msg.text && <p>{msg.text}</p>}
                  </div>
                ) : (
                  msg.text
                )}
              </div>

              {/* Only show "Delivered" if it's the last message in a group and it's mine */}
              <div className="chat-footer opacity-50 text-[10px] mt-1 flex items-center gap-1">
                {(isMyMsg && (index === messages.length - 1 || messages[index + 1].isMyMessage !== isMyMsg)) ? 'Delivered' : ''}
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
