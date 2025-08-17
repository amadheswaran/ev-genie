import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* SEO Meta */}
        <meta
          name="description"
          content="EV Helper – Find EV charging stations, calculate savings, and explore subsidies across India."
        />
        <meta name="keywords" content="EV charging stations, electric vehicles, subsidies, calculator, India" />
        <meta name="author" content="EV Helper" />
        <meta name="color-scheme" content="light dark" />

        {/* Open Graph */}
        <meta property="og:title" content="EV Helper – EV Charging & Subsidies" />
        <meta
          property="og:description"
          content="Find EV charging stations, calculate savings, and explore subsidies across India."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/preview.png" />

        {/* Adsense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
          crossOrigin="anonymous"
        ></script>

        {/* Tailwind & Leaflet */}
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      </Head>
      <body className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black text-gray-900 dark:text-gray-100 font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
