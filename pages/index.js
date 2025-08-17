import Head from "next/head";
import { useState } from "react";
import EVMap from "../components/EVMap";
import Calculator from "../components/Calculator";
import Subsidies from "../components/Subsidies";
import DarkModeToggle from "../components/DarkModeToggle";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"}>
      <Head>
        <title>EV Helper – Find EV Stations & Subsidies</title>
        <meta name="description" content="EV Helper – EV charging stations, subsidies, and calculator." />
      </Head>

      {/* Nav */}
      <nav className="flex justify-between items-center p-4 shadow-md bg-green-600 text-white">
        <div className="flex items-center gap-2">
          <img src="/logo-light.png" alt="EV Helper Logo" className="h-8 dark:hidden" />
          <img src="/logo-dark.png" alt="EV Helper Logo Dark" className="h-8 hidden dark:block" />
          <span className="text-xl font-bold">EV Helper</span>
        </div>
        <ul className="flex gap-6">
          <li><a href="#map" className="hover:underline">Charging Stations</a></li>
          <li><a href="#calculator" className="hover:underline">Calculator</a></li>
          <li><a href="#subsidies" className="hover:underline">Subsidies</a></li>
        </ul>
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </nav>

      {/* Sections */}
      <section id="map" className="p-6"><EVMap /></section>
      <section id="calculator" className="p-6"><Calculator /></section>
      <section id="subsidies" className="p-6"><Subsidies /></section>
    </div>
  );
}
