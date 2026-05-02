import { AuthProvider } from "@/store/AuthContext";
import { Toaster } from "react-hot-toast";
import NextTopLoader from 'nextjs-toploader';
import "../app/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;700&family=Montserrat:wght@400;700;900&family=Playfair+Display:ital,wght@0,700;1,700&family=Roboto+Mono:wght@400;700&family=Anton&family=Pacifico&family=Inter:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
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


