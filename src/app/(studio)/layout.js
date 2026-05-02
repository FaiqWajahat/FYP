import { AuthProvider } from "@/store/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/Components/site/Navbar";

// Studio layout — clean, distraction-free inquiry experience (no chat widget, no footer)
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
    </AuthProvider>
  );
}
