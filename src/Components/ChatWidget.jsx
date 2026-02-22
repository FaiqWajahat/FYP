"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Paperclip, Send } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // 1. Static Initial Data
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! Welcome to Factory Flow Support.", 
      sender: "admin", 
      time: "10:23 AM",
      type: "text"
    },
    { 
      id: 2, 
      text: "How can we help you with your manufacturing order today?", 
      sender: "admin", 
      time: "10:24 AM",
      type: "text"
    }
  ]);

  // 2. Auto-scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    
    const newItem = { 
      id: Date.now(), 
      text: msg, 
      sender: "user", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "text" 
    };
    
    setMessages((prev) => [...prev, newItem]);
    setMsg("");
  };

  return (
    // FIX 1: Added 'pointer-events-none' to the main container.
    // This ensures the invisible wrapper NEVER blocks clicks on elements behind it (like the Navbar).
    <div className="fixed bottom-6 right-6 z-[10000] flex flex-col items-end font-sans pointer-events-none">
      
      {/* --- CHAT CONTAINER --- */}
      <div 
        className={`
          mb-4 w-[350px] sm:w-[380px] max-h-[80vh] h-[550px]
          bg-gray-100 rounded-2xl shadow-2xl border border-gray-300 overflow-hidden flex flex-col
          transition-all duration-300 ease-in-out transform origin-bottom-right
          ${isOpen 
            ? "scale-100 opacity-100 translate-y-0 pointer-events-auto" // FIX 2: Re-enable clicks only when OPEN
            : "scale-95 opacity-0 translate-y-10 pointer-events-none"   // Keep disabled when closed
          }
        `}
      >
          
          {/* --- HEADER --- */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md flex-shrink-0 z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10">
                   <img 
                     src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100" 
                     alt="Support" 
                     className="object-cover w-full h-full"
                   />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wide">Factory Flow Support</span>
                <span className="text-[10px] text-blue-100 uppercase tracking-wider">Typically replies in 5m</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* --- MESSAGES AREA --- */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`
                  max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm
                  ${m.sender === "user" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }
                `}>
                  {m.text}
                  <div className={`text-[10px] mt-1 font-medium ${m.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* --- INPUT AREA --- */}
          <form 
            onSubmit={handleSend} 
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 flex-shrink-0"
          >
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Paperclip size={20} />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
            
            <input 
              type="text" 
              className="flex-1 bg-gray-100 text-gray-800 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              placeholder="Type your message..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />

            <button 
              type="submit" 
              disabled={!msg.trim()}
              className={`
                p-2.5 rounded-full transition-all duration-200 flex items-center justify-center
                ${msg.trim() 
                  ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 transform hover:scale-105' 
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }
              `}
            >
              <Send size={18} className={msg.trim() ? "ml-0.5" : ""} />
            </button>
          </form>
      </div>

      {/* --- TOGGLE BUTTON (FAB) --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        // FIX 3: Added 'pointer-events-auto' so the button is always clickable, even though parent is 'none'
        className={`
            w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-[10000] pointer-events-auto
            ${isOpen 
                ? "bg-white text-black rotate-90 hover:bg-gray-100 ring-2 ring-gray-200" 
                : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-110"
            }
        `}
      >
        {isOpen ? <X size={28} /> : <MessageCircle fill="white" size={32} />}
      </button>
    </div>
  );
}