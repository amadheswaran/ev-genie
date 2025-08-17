// /pages/_app.js
import "../styles/globals.css";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Google Analytics (replace with your GA ID if needed)
    if (typeof window !== "undefined" && !window.GA_INITIALIZED) {
      window.GA_INITIALIZED = true;
      // Example GA init - replace with actual snippet if using GA4
    }
  }, []);

  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
