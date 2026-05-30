import { AuthProvider } from "@/store/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/Components/site/Navbar";
import ChatWidget from "@/Components/common/ChatWidget";

// Studio layout — clean, distraction-free inquiry experience (includes AI chat copilot)
export default function StudioLayout({ children }) {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen bg-slate-50/80 pt-36 pb-10 font-sans">
        {children}
      </main>
      <ChatWidget />
    </AuthProvider>
  );
}
