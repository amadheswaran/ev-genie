// pages/index.js (Next.js page)
import Head from "next/head";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

// ------- Small SVG Logo (inline, no external asset) -------
function EVLogo({ className = "h-8 w-8" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={className}
      aria-label="EV Helper logo"
    >
      <defs>
        <linearGradient id="evg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#evg)" />
      <path
        d="M22 38h10l-6 10h4l6-10h6l-8-14h-6l6 10h-8z"
        fill="#fff"
      />
      <circle cx="22" cy="44" r="2" fill="#fff" />
      <circle cx="42" cy="44" r="2" fill="#fff" />
    </svg>
  );
}

// ------- Navbar -------
function Navbar() {
  return (
    <nav className="bg-white/90 backdrop-blur shadow sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <EVLogo className="h-9 w-9" />
          <div className="leading-tight">
            <div className="font-bold text-gray-900">EV Helper</div>
            <div className="text-xs text-gray-500">Stations · Subsidies · Savings</div>
          </div>
        </a>
        <div className="flex items-center gap-2 text-sm">
          <a href="#stations" className="px-3 py-2 rounded hover:bg-gray-100">Find Stations</a>
          <a href="#calculator" className="px-3 py-2 rounded hover:bg-gray-100">Calculator</a>
          <a href="#subsidies" className="px-3 py-2 rounded hover:bg-gray-100">Subsidies</a>
        </div>
      </div>
    </nav>
  );
}

// ------- Calculator -------
function fmt(n, d = 0) {
  if (!isFinite(n)) return "—";
  return Number(n).toLocaleString("en-IN", {
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  });
}

function Calculator() {
  const [distance, setDistance] = useState(1000); // km/month
  const [petrolPrice, setPetrolPrice] = useState(106);
  const [petrolMileage, setPetrolMileage] = useState(20);
  const [electricityRate, setElectricityRate] = useState(8);
  const [evEfficiency, setEvEfficiency] = useState(5);
  const [extraCost, setExtraCost] = useState(300000);

  const safePetrolMileage = Math.max(0.0001, Number(petrolMileage) || 0.0001);
  const safeEvEfficiency = Math.max(0.0001, Number(evEfficiency) || 0.0001);

  const petrolPerKm = (Number(petrolPrice) || 0) / safePetrolMileage;
  const evPerKm = (Number(electricityRate) || 0) / safeEvEfficiency;

  const petrolCost = (Number(distance) || 0) * petrolPerKm;
  const electricCost = (Number(distance) || 0) * evPerKm;

  const monthlySavings = petrolCost - electricCost;
  const annualSavings = monthlySavings * 12;

  const breakevenMonths = monthlySavings > 0 ? (Number(extraCost) || 0) / monthlySavings : null;

  // Chart.js (lazy import on first render & when data changes)
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { default: Chart } = await import("chart.js/auto");
      if (!mounted || !canvasRef.current) return;
      // destroy previous
      if (chartRef.current) chartRef.current.destroy();
      const ctx = canvasRef.current.getContext("2d");
      const data = Array.from({ length: 24 }, (_, i) => Math.max(0, (i + 1) * monthlySavings));
      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: Array.from({ length: 24 }, (_, i) => `${i + 1}`),
          datasets: [
            {
              label: "Cumulative Savings (₹)",
              data,
              fill: true,
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          elements: { line: { tension: 0.3 } },
        },
      });
    })();
    return () => {
      mounted = false;
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [monthlySavings]);

  return (
    <section id="calculator" className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h2 className="text-2xl font-semibold mb-1 text-gray-800">💰 EV Cost Savings Calculator</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <label className="block text-sm text-gray-600">Monthly distance (km)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value || 0))}
            className="w-full border p-2 rounded mb-3"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Petrol price (₹/L)</label>
              <input
                type="number"
                value={petrolPrice}
                onChange={(e) => setPetrolPrice(Number(e.target.value || 0))}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Petrol mileage (km/L)</label>
              <input
                type="number"
                value={petrolMileage}
                onChange={(e) => setPetrolMileage(Number(e.target.value || 0))}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-sm text-gray-600">Electricity rate (₹/kWh)</label>
              <input
                type="number"
                value={electricityRate}
                onChange={(e) => setElectricityRate(Number(e.target.value || 0))}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">EV efficiency (km/kWh)</label>
              <input
                type="number"
                value={evEfficiency}
                onChange={(e) => setEvEfficiency(Number(e.target.value || 0))}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <label className="block text-sm text-gray-600 mt-3">Extra EV cost vs petrol (₹)</label>
          <input
            type="number"
            value={extraCost}
            onChange={(e) => setExtraCost(Number(e.target.value || 0))}
            className="w-full border p-2 rounded"
          />

          <div className="mt-4 bg-gray-50 border rounded p-3 text-center">[AdSense Placeholder - Calculator]</div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-sm text-gray-500">Monthly comparison</h4>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Petrol cost</span>
                <span className="font-medium text-red-600">₹{fmt(petrolCost, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Electric cost</span>
                <span className="font-medium text-green-600">₹{fmt(electricCost, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Monthly savings</span>
                <span className="font-bold text-blue-600">₹{fmt(monthlySavings, 0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <div className="text-sm text-gray-500">Annual savings</div>
            <div className="text-3xl font-bold text-green-700 mt-2">₹{fmt(annualSavings, 0)}</div>
            <div className="text-xs text-gray-400 mt-2">Estimate based on inputs</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-sm text-gray-600 mb-2">⚖️ Breakeven</h4>
            {breakevenMonths ? (
              <>
                <div className="flex justify-between">
                  <span>Months</span>
                  <span className="text-purple-600 font-medium">{fmt(breakevenMonths, 1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Years</span>
                  <span className="text-purple-600 font-medium">{fmt(breakevenMonths / 12, 2)}</span>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-600">No positive monthly savings → breakeven not reachable.</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h4 className="text-sm text-gray-500 mb-3">Cumulative savings (24 months)</h4>
        <div style={{ width: "100%", height: 300 }}>
          <canvas ref={canvasRef} height={260} />
        </div>
        <div className="mt-4 text-center">[AdSense Placeholder - Chart]</div>
      </div>
    </section>
  );
}

// ------- Map (Leaflet via dynamic import) -------
function Stations() {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const leaflet = await import("leaflet");
      const L = leaflet.default || leaflet;
      // fix marker asset urls
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      if (!mounted || !mapDivRef.current) return;

      const map = L.map(mapDivRef.current).setView([12.9716, 77.5946], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
      mapRef.current = map;

      // sample stations
      const stations = [
        { name: "MG Road Charging Point", lat: 12.975, lng: 77.605 },
        { name: "Indiranagar EV Station", lat: 12.978, lng: 77.64 },
        { name: "Koramangala Fast Charger", lat: 12.935, lng: 77.616 },
      ];
      stations.forEach((s) => L.marker([s.lat, s.lng]).addTo(map).bindPopup(`⚡ ${s.name}`));

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords;
          map.setView([latitude, longitude], 14);
          L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("📍 You are here")
            .openPopup();
        });
      }
    })();
    return () => {
      mounted = false;
      try {
        mapRef.current && mapRef.current.remove();
      } catch (e) {}
    };
  }, []);

  return (
    <section id="stations" className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">🔌 Charging Stations Near You</h2>
      {/* Leaflet CSS link for SSR safety */}
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </Head>
      <div ref={mapDivRef} className="h-96 w-full rounded-xl overflow-hidden border shadow" />
      <div className="mt-3 text-xs text-gray-500">
        Tip: Allow location access for best results. If denied, defaults to Bengaluru center.
      </div>
    </section>
  );
}

// ------- Subsidies (static snapshot) -------
function Subsidies() {
  const items = [
    { state: "Karnataka", details: "₹10,000 subsidy on electric 2-wheelers" },
    { state: "Maharashtra", details: "₹1.5 lakh subsidy on electric cars" },
    { state: "Delhi", details: "₹30,000 subsidy on electric 2-wheelers" },
    { state: "Tamil Nadu", details: "Road tax exemption for EV buyers" },
  ];
  return (
    <section id="subsidies" className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">📜 State EV Subsidies</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((s) => (
          <div key={s.state} className="bg-white p-6 rounded-2xl shadow border">
            <div className="font-semibold">{s.state}</div>
            <div className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{s.details}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-gray-100 p-3 text-center">[AdSense Placeholder - Subsidies]</div>
    </section>
  );
}

// ------- Page -------
export default function Home() {
  return (
    <div id="home" className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <Head>
        <title>EV Helper – Charging Stations, Calculator & Subsidies</title>
        <meta
          name="description"
          content="Find EV charging stations near you, calculate savings, and explore state EV subsidies across India."
        />
      </Head>

      <Navbar />

      <header className="text-center py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Drive Electric, Save More 🚗⚡
        </h1>
        <p className="mt-3 text-gray-600">
          Find charging stations near you, calculate EV savings, and explore state subsidies
        </p>
      </header>

      <Stations />
      <Calculator />
      <Subsidies />

      <footer className="text-center text-sm text-gray-600 py-8 mt-4">
        © 2025 EV Helper India
      </footer>

      {/* Chart.js via CDN as a fallback (optional). The Calculator dynamically imports chart.js/auto already. */}
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
        strategy="lazyOnload"
      />
    </div>
  );
}
