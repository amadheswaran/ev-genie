import Head from "next/head";
import Calculator from "../components/Calculator";
import Subsidies from "../components/Subsidies";

import dynamic from "next/dynamic";

const EVMap = dynamic(() => import("../components/EVMap"), {
  ssr: false, // disable server-side rendering
});

export default function Home() {
  return (
    <>
      <Head>
        <title>EV Helper - Charging, Savings & Subsidies</title>
        <meta
          name="description"
          content="Find EV charging stations near you, calculate EV savings, and explore state subsidies."
        />
      </Head>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        {/* Navbar */}
        <nav className="bg-green-600 text-white shadow-md">
          <div className="container mx-auto flex justify-between items-center p-4">
            <h1 className="text-xl font-bold">⚡ EV Helper</h1>
            <ul className="flex space-x-6">
              <li><a href="#map" className="hover:underline">Stations</a></li>
              <li><a href="#calculator" className="hover:underline">Calculator</a></li>
              <li><a href="#subsidies" className="hover:underline">Subsidies</a></li>
            </ul>
          </div>
        </nav>

        {/* Hero */}
        <header className="bg-green-100 text-center py-12 px-4">
          <h2 className="text-3xl font-bold text-green-800 mb-2">Your One-Stop EV Assistant</h2>
          <p className="text-lg text-green-700">Find charging stations, estimate savings, and check subsidies in your state.</p>
        </header>

        {/* Sections */}
        <main className="flex-1 container mx-auto px-4 py-8 space-y-12">
          <section id="map">
            <h3 className="text-2xl font-bold mb-4">🔌 EV Charging Stations Near You</h3>
            <EVMap />
          </section>

          <section id="calculator">
            <h3 className="text-2xl font-bold mb-4">💰 EV Savings Calculator</h3>
            <Calculator />
          </section>

          <section id="subsidies">
            <h3 className="text-2xl font-bold mb-4">🏛 State-wise EV Subsidies</h3>
            <Subsidies />
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-green-600 text-white text-center py-4">
          <p>© {new Date().getFullYear()} EV Helper. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
