// /pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Dark Mode Color Scheme */}
        <meta name="color-scheme" content="light dark" />

        {/* SEO Meta */}
        <meta
          name="description"
          content="EV Helper – Find EV charging stations, calculate savings, and explore subsidies across India."
        />
        <meta name="keywords" content="EV charging stations, electric vehicles, subsidies, calculator, India" />
        <meta name="author" content="EV Helper" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="EV Helper – EV Charging & Subsidies" />
        <meta
          property="og:description"
          content="Find EV charging stations, calculate savings, and explore subsidies across India."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/preview.png" />

        {/* Adsense (async load) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
          crossOrigin="anonymous"
        ></script>
            
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>

      </Head>
      <body className="bg-white dark:bg-gray-900 text-black dark:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
