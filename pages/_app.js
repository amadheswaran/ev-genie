// /pages/_app.js
import "leaflet/dist/leaflet.css";
import "../styles/globals.css"; // keep your global styles
import { useEffect } from "react";

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
