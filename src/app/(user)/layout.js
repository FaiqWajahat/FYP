
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import ChatWidget from "@/Components/ChatWidget";

export default function UserLayout({ children }) {
  return (
   <>
        <header >
          <Navbar />
        </header>
        <main className="min-h-screen bg-white">{children}</main>
        <ChatWidget/>
        <footer>
          <Footer />
        </footer>
        </>
     
  );
}
