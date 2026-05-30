"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Paperclip, Send } from "lucide-react";
import { useAuth } from "@/store/AuthContext";
import { useConfigStore } from "@/store/useConfigStore";
import { useInquiryStore } from "@/store/useInquiryStore";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// Markdown → safe HTML renderer
// Splits the text into markdown-token segments and plain-text segments,
// processes each type independently so HTML escaping never touches markdown.
// ─────────────────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(text) {
  if (!text) return "";

  // Combined regex: matches markdown links [label](url) OR **bold**
  // Processed left-to-right so plain text between tokens gets escaped safely.
  const COMBINED = /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]*)\)|\*\*(.*?)\*\*/g;

  let html = "";
  let lastIndex = 0;
  let match;

  COMBINED.lastIndex = 0;
  while ((match = COMBINED.exec(text)) !== null) {
    // Append escaped plain text before this match
    html += escapeHtml(text.slice(lastIndex, match.index));

    if (match[1] !== undefined) {
      // It's a markdown link: [label](url)
      const label = escapeHtml(match[1]);
      const url = match[2].replace(/"/g, "%22");
      html += `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#818cf8;text-decoration:underline;font-weight:700;">${label} ↗</a>`;
    } else {
      // It's bold: **text**
      const inner = escapeHtml(match[3]);
      html += `<strong>${inner}</strong>`;
    }

    lastIndex = match.index + match[0].length;
  }

  // Append any remaining plain text after the last match
  html += escapeHtml(text.slice(lastIndex));

  // --- Step 2: Newlines → <br /> ---
  html = html.replace(/\n/g, "<br />");

  // --- Step 3: Bullet list items (- or * at start of logical line) ---
  html = html.replace(
    /(?:^|<br \/>)\s*[-*]\s+(.*?)(?=<br \/>|$)/g,
    (_, p1) =>
      `<div style="padding-left:1rem;display:flex;align-items:flex-start;gap:6px;margin-top:4px;"><span style="color:#818cf8;font-weight:700;">•</span><span>${p1}</span></div>`
  );

  return html;
}

const WELCOME_MSG = {
  id: "welcome",
  sender_id: "ai",
  content:
    "Hello! I am your AI Manufacturing Copilot. Ask me anything about fabric weights (GSM), MOQ, sizing, packaging, or branding options — and I can recommend specific products from our catalog!",
  created_at: new Date().toISOString(),
};

export default function ChatWidget() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isChatOpen: isOpen, setIsChatOpen: setIsOpen, chatContext, setChatContext } = useConfigStore();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // AI Copilot States
  const [aiMode, setAiMode] = useState(false);
  const [aiMessages, setAiMessages] = useState([WELCOME_MSG]);
  const [aiLoading, setAiLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, aiMessages, isOpen, isSending]);

  // ── Auto-fill context message ───────────────────────────────────────────────
  useEffect(() => {
    if (isOpen && chatContext && !msg) {
      setMsg(chatContext);
      setChatContext(null);
    }
  }, [isOpen, chatContext]);

  // ── Anonymous sign-in ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen && !user) {
      supabase.auth.signInAnonymously().catch((err) =>
        console.error("Anon sign in failed", err)
      );
    }
  }, [isOpen, user]);

  // ── Load AI messages from Supabase (per user) ──────────────────────────────
  useEffect(() => {
    if (!isOpen || !aiMode || !user) return;

    const loadAiHistory = async () => {
      setAiLoading(true);
      try {
        const { data, error } = await supabase
          .from("ai_messages")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true })
          .limit(100);

        if (error) {
          // Table might not exist yet — fall back to welcome msg only
          console.warn("ai_messages table not ready:", error.message);
          setAiMessages([WELCOME_MSG]);
        } else if (data && data.length > 0) {
          setAiMessages([
            WELCOME_MSG,
            ...data.map((row) => ({
              id: row.id,
              sender_id: row.role === "user" ? user.id : "ai",
              content: row.content,
              file_url: row.file_url || null,
              file_type: row.file_type || null,
              created_at: row.created_at,
            })),
          ]);
        } else {
          setAiMessages([WELCOME_MSG]);
        }
      } finally {
        setAiLoading(false);
      }
    };

    loadAiHistory();
  }, [isOpen, aiMode, user]);

  // ── Persist a single AI message to Supabase ────────────────────────────────
  const persistAiMessage = useCallback(
    async (role, content, fileUrl = null, fileType = null) => {
      if (!user) return;
      try {
        await supabase.from("ai_messages").insert({
          user_id: user.id,
          role, // 'user' | 'assistant'
          content,
          file_url: fileUrl,
          file_type: fileType,
        });
      } catch (e) {
        console.error("Failed to persist AI message:", e);
      }
    },
    [user]
  );

  // ── Load live chat messages ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || aiMode || !user) return;

    let channel = null;

    const fetchUserChat = async () => {
      try {
        setIsLoading(true);
        let { data: conv, error: convError } = await supabase
          .from("conversations")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();

        if (convError && convError.code !== "PGRST116") throw convError;

        if (!conv) {
          const { data: newConv, error: createError } = await supabase
            .from("conversations")
            .insert({ user_id: user.id })
            .select()
            .single();
          if (createError) throw createError;
          conv = newConv;
        }

        setConversation(conv);

        const { data: msgs, error: msgError } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: true });

        if (!msgError && msgs) setMessages(msgs);

        channel = supabase
          .channel(`widget:chat:${conv.id}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `conversation_id=eq.${conv.id}`,
            },
            (payload) => {
              const newMsg = payload.new;
              setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
            }
          )
          .subscribe();
      } catch (err) {
        console.error("Error fetching chat:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserChat();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [isOpen, user, aiMode]);

  // ── Send handler ────────────────────────────────────────────────────────────
  const handleSend = async (e) => {
    e?.preventDefault();
    if (!msg.trim() && !fileInputRef.current?.files[0]) return;

    const file = fileInputRef.current?.files[0];
    const textContent = msg.trim();
    setMsg("");
    setIsSending(true);

    // ── AI MODE ──
    if (aiMode) {
      let fileUrl = null;
      let fileType = null;

      try {
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
          const uploadResult = await uploadRes.json();
          if (uploadResult.success) {
            fileUrl = uploadResult.url;
            fileType = file.type;
          }
          if (fileInputRef.current) fileInputRef.current.value = "";
        }

        const userMsg = {
          id: `user-${Date.now()}`,
          sender_id: user?.id || "user",
          content: textContent || (file ? file.name : ""),
          file_url: fileUrl,
          file_type: fileType,
          created_at: new Date().toISOString(),
        };

        setAiMessages((prev) => [...prev, userMsg]);

        // Persist user message to Supabase
        await persistAiMessage("user", userMsg.content, fileUrl, fileType);

        // Build history for API (exclude welcome)
        const chatHistory = aiMessages
          .filter((m) => m.id !== "welcome")
          .map((m) => ({
            sender: m.sender_id === "ai" ? "model" : "user",
            text: m.content,
            fileUrl: m.file_url || null,
            fileType: m.file_type || null,
          }));

        chatHistory.push({
          sender: "user",
          text: textContent || (file ? file.name : ""),
          fileUrl,
          fileType,
        });

        const inquiryState = useInquiryStore.getState();
        const context = {
          category: inquiryState.categoryId,
          fabric: inquiryState.fabricId,
          gsm: inquiryState.gsm,
          colorType: inquiryState.colorType,
          timeline: inquiryState.timeline,
          destination: inquiryState.destination,
        };

        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: chatHistory, context }),
        });

        const data = await res.json();
        const aiContent = data.success
          ? data.text
          : `⚠️ Error: ${data.error || "Failed to generate response"}`;

        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender_id: "ai",
          content: aiContent,
          created_at: new Date().toISOString(),
        };

        setAiMessages((prev) => [...prev, aiMsg]);

        // Persist AI reply to Supabase
        await persistAiMessage("assistant", aiContent);
      } catch (err) {
        console.error("AI chat failed", err);
        setAiMessages((prev) => [
          ...prev,
          {
            id: `ai-err-${Date.now()}`,
            sender_id: "ai",
            content: `⚠️ Connection error: ${err.message || "Please try again."}`,
            created_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsSending(false);
      }
      return;
    }

    // ── LIVE CHAT MODE ──
    if (!user) { setIsSending(false); return; }

    try {
      let fileUrl = null;
      let fileType = null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadResult = await uploadRes.json();
        if (uploadResult.success) { fileUrl = uploadResult.url; fileType = file.type; }
        if (fileInputRef.current) fileInputRef.current.value = "";
      }

      if (!conversation) throw new Error("Conversation not ready");
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        content: textContent || (file ? file.name : ""),
        file_url: fileUrl,
        file_type: fileType,
      });
      if (error) throw error;

      await supabase
        .from("conversations")
        .update({ last_message: textContent || "Sent an attachment" })
        .eq("id", conversation.id);
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
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] text-blue-100 uppercase tracking-wider">
                  {aiMode ? "🤖 AI Copilot Active" : "💬 Live Chat Mode"}
                </span>
                <span className="text-blue-300/40">|</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="toggle toggle-xs bg-white checked:bg-emerald-400 checked:border-emerald-400 cursor-pointer"
                    checked={aiMode}
                    onChange={(e) => setAiMode(e.target.checked)}
                  />
                  <span className="text-[9px] font-black text-blue-200 uppercase tracking-wider">AI Mode</span>
                </label>
              </div>
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
          {(aiMode ? aiLoading : isLoading) ? (
            <div className="space-y-4 animate-pulse">
              <div className="flex justify-start">
                <div className="w-[70%] bg-slate-200 h-14 rounded-2xl rounded-bl-none"></div>
              </div>
              <div className="flex justify-end">
                <div className="w-[50%] bg-slate-300 h-10 rounded-2xl rounded-br-none"></div>
              </div>
              <div className="flex justify-start">
                <div className="w-[60%] bg-slate-200 h-12 rounded-2xl rounded-bl-none"></div>
              </div>
            </div>
          ) : (aiMode ? aiMessages : messages).length === 0 ? (
            <div className="text-center text-gray-400 text-sm mt-10">
              Send a message to start the conversation!
            </div>
          ) : (
            (aiMode ? aiMessages : messages).map((m) => {
              const isMine = aiMode
                ? (m.sender_id !== "ai")
                : (user ? m.sender_id === user.id : !m.sender_id);
              const timeString = new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`
                      max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm
                      ${isMine
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                      }
                    `}
                  >
                    {m.file_url ? (
                      <div className="mb-2">
                        {m.file_type?.startsWith("image/") ? (
                          <img src={m.file_url} alt="attachment" className="max-w-full rounded-md max-h-32 object-cover" />
                        ) : (
                          <a href={m.file_url} target="_blank" rel="noreferrer" className="underline font-bold text-xs">
                            View Attachment
                          </a>
                        )}
                      </div>
                    ) : null}
                    <div>
                      {aiMode && m.sender_id === "ai" ? (
                        <span dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }} />
                      ) : (
                        m.content
                      )}
                    </div>
                    <div className={`text-[10px] mt-1 font-medium ${isMine ? "text-blue-100" : "text-gray-400"}`}>
                      {timeString}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {isSending && aiMode && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm bg-white border border-gray-200 rounded-bl-none">
                <div className="flex gap-1 items-center py-1">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
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
              if (e.target.files[0] && !msg.trim()) {
                handleSend(new Event("submit"));
              }
            }}
          />

          <input
            type="text"
            className="flex-1 bg-gray-100 text-gray-800 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            placeholder={aiMode ? "Ask the AI copilot..." : "Type your message..."}
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
                ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 transform hover:scale-105"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
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