
import Navbar from "@/Components/site/Navbar";
import Footer from "@/Components/site/Footer";
import ChatWidget from "@/Components/common/ChatWidget";

export default function UserLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
        <header >
          <Navbar />
        </header>
        <main className="flex-1 bg-slate-50 pt-24 pb-20 font-sans flex flex-col">{children}</main>
        <ChatWidget/>
        <Footer />
    </div>
     
  );
}
