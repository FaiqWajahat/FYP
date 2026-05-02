"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Paperclip, Send } from "lucide-react";
import { useAuth } from "@/store/AuthContext";
import { supabase } from "@/lib/supabase";

function generateGuestId() {
  const newId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  localStorage.setItem('factory_flow_guest_id', newId);
  return newId;
}

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [guestId, setGuestId] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Handle anonymous login when opened
  useEffect(() => {
    if (isOpen && !user) {
      supabase.auth.signInAnonymously().catch(err => console.error("Anon sign in failed", err));
    }
  }, [isOpen, user]);

  // Handle initialization & fetching
  useEffect(() => {
    if (!isOpen || !user) return;

    let channel = null;

    const fetchUserChat = async () => {
      try {
        let { data: conv, error: convError } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (convError && convError.code !== 'PGRST116') throw convError;

        if (!conv) {
          const { data: newConv, error: createError } = await supabase
            .from('conversations')
            .insert({ user_id: user.id })
            .select()
            .single();
          if (createError) throw createError;
          conv = newConv;
        }

        setConversation(conv);

        const { data: msgs, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true });

        if (!msgError && msgs) setMessages(msgs);

        // Subscribe to real-time (works for BOTH anon and logged-in users)
        channel = supabase
          .channel(`widget:chat:${conv.id}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conv.id}` },
            (payload) => {
              const newMsg = payload.new;
              setMessages(prev => {
                if (prev.some(m => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
            }
          )
          .subscribe();

      } catch (err) {
        console.error("Error fetching chat:", err);
      }
    };

    fetchUserChat();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [isOpen, user]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!msg.trim() && !fileInputRef.current?.files[0]) return;
    if (!user) return;
    
    const file = fileInputRef.current?.files[0];
    const textContent = msg.trim();
    setMsg("");
    setIsSending(true);

    try {
      let fileUrl = null;
      let fileType = null;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadResult = await uploadRes.json();
        if (uploadResult.success) {
          fileUrl = uploadResult.url;
          fileType = file.type;
        } else {
          throw new Error('File upload failed');
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
      }

      if (!conversation) throw new Error("Conversation not ready");
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          content: textContent || (file ? file.name : ""),
          file_url: fileUrl,
          file_type: fileType,
        });
      if (error) throw error;
      
      // Update last_message manually since the trigger might not exist
      await supabase.from('conversations').update({ last_message: textContent || "Sent an attachment" }).eq('id', conversation.id);

    } catch (err) {
      console.error("Send failed", err);
    } finally {
      setIsSending(false);
    }
  };


  return (
    <div className="fixed bottom-6 right-6 z-[10000] flex flex-col items-end font-sans pointer-events-none">
      
      {/* --- CHAT CONTAINER --- */}
      <div 
        className={`
          mb-4 w-[350px] sm:w-[380px] max-h-[80vh] h-[550px]
          bg-gray-100 rounded-2xl shadow-2xl border border-gray-300 overflow-hidden flex flex-col
          transition-all duration-300 ease-in-out transform origin-bottom-right
          ${isOpen 
            ? "scale-100 opacity-100 translate-y-0 pointer-events-auto" 
            : "scale-95 opacity-0 translate-y-10 pointer-events-none"
          }
        `}
      >
          {/* --- HEADER --- */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md flex-shrink-0 z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center font-bold text-lg">
                   FF
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wide">Factory Flow Support</span>
                <span className="text-[10px] text-blue-100 uppercase tracking-wider">
                  {user && !user.is_anonymous ? "Authenticated Secure Chat" : "Guest Chat Mode"}
                </span>
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
            {messages.length === 0 && (
               <div className="text-center text-gray-400 text-sm mt-10">
                 Send a message to start the conversation!
               </div>
            )}
            {messages.map((m) => {
              // A message is from the user if it has their sender_id, OR if they are a guest and it has NO sender_id.
              const isMine = user ? m.sender_id === user.id : (m.sender_id === null || m.sender_id === undefined);
              const timeString = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`
                    max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm
                    ${isMine 
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    }
                    ${m.isSending ? "opacity-70" : ""}
                  `}>
                    {m.file_url ? (
                      <div className="mb-2">
                        {m.file_type?.startsWith('image/') ? (
                          <img src={m.file_url} alt="attachment" className="max-w-full rounded-md max-h-32 object-cover" />
                        ) : (
                          <a href={m.file_url} target="_blank" rel="noreferrer" className="underline font-bold text-xs">
                            View Attachment
                          </a>
                        )}
                      </div>
                    ) : null}
                    <div>{m.content}</div>
                    <div className={`text-[10px] mt-1 font-medium ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                      {timeString} {m.isSending && "(Sending...)"}
                    </div>
                  </div>
                </div>
              );
            })}
            {isSending && (
               <div className="flex justify-end">
                 <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm bg-blue-600/70 text-white rounded-br-none italic animate-pulse">
                   Sending...
                 </div>
               </div>
            )}
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
              disabled={isSending}
            >
              <Paperclip size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => {
                if(e.target.files[0]) {
                  // auto-send if they pick a file without text
                  if (!msg.trim()) {
                    handleSend(new Event('submit'));
                  }
                }
              }}
            />
            
            <input 
              type="text" 
              className="flex-1 bg-gray-100 text-gray-800 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              placeholder="Type your message..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              disabled={isSending}
            />

            <button 
              type="submit" 
              disabled={(!msg.trim() && !fileInputRef.current?.files[0]) || isSending}
              className={`
                p-2.5 rounded-full transition-all duration-200 flex items-center justify-center
                ${msg.trim() || fileInputRef.current?.files[0]
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