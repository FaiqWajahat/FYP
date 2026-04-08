import { AuthProvider } from "@/store/AuthContext";
import { Toaster } from "react-hot-toast";
import NextTopLoader from 'nextjs-toploader';
import "../app/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader 
          color="var(--primary)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--primary),0 0 5px var(--primary)"
        />
        <Toaster position="top-right" reverseOrder={false} />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}


