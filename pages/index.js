// pages/index.js
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

// ----------------- Utilities -----------------
const fmt = (n, d = 0) => {
  if (!isFinite(n)) return '—';
  return Number(n).toLocaleString('en-IN', { maximumFractionDigits: d, minimumFractionDigits: d });
};

function dedupeStations(items) {
  const out = [];
  for (const s of items) {
    const exists = out.some(
      (t) =>
        (t.name || '').toLowerCase() === (s.name || '').toLowerCase() &&
        Math.abs((t.latitude || 0) - (s.latitude || 0)) < 0.0008 &&
        Math.abs((t.longitude || 0) - (s.longitude || 0)) < 0.0008
    );
    if (!exists) out.push(s);
  }
  return out;
}

function ensureLeafletCss() {
  if (typeof document === 'undefined') return;
  const id = 'leaflet-css';
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
}

// ----------------- Navbar -----------------
function Navbar({ active, setActive }) {
  const items = [
    { id: 'calculator', label: 'Calculator', emoji: '💰' },
    { id: 'stations', label: 'Charging Stations', emoji: '🔌' },
    { id: 'subsidies', label: 'Subsidies', emoji: '🎁' }
  ];
  return (
    <header className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⚡</div>
          <div>
            <div className="font-bold">EV Helper</div>
            <div className="text-xs text-gray-500">Stations · Subsidies · Savings</div>
          </div>
        </div>

        <nav className="flex gap-3">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => setActive(it.id)}
              className={`px-3 py-2 rounded ${active === it.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <span className="mr-2">{it.emoji}</span>
              {it.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

// ----------------- Calculator -----------------
function Calculator() {
  const [distance, setDistance] = useState(1000); // km/month
  const [petrolPrice, setPetrolPrice] = useState(106);
  const [petrolMileage, setPetrolMileage] = useState(20);
  const [electricityRate, setElectricityRate] = useState(8);
  const [evEfficiency, setEvEfficiency] = useState(5);
  const [extraCost, setExtraCost] = useState(300000);

  const safePetrolMileage = Math.max(0.0001, Number(petrolMileage) || 0.0001);
  const safeEvEfficiency = Math.max(0.0001, Number(evEfficiency) || 0.0001);

  const petrolPerKm = useMemo(() => (Number(petrolPrice) || 0) / safePetrolMileage, [petrolPrice, safePetrolMileage]);
  const evPerKm = useMemo(() => (Number(electricityRate) || 0) / safeEvEfficiency, [electricityRate, safeEvEfficiency]);

  const petrolCost = useMemo(() => (Number(distance) || 0) * petrolPerKm, [distance, petrolPerKm]);
  const electricCost = useMemo(() => (Number(distance) || 0) * evPerKm, [distance, evPerKm]);

  const monthlySavings = useMemo(() => petrolCost - electricCost, [petrolCost, electricCost]);
  const annualSavings = useMemo(() => monthlySavings * 12, [monthlySavings]);

  const breakevenMonths = useMemo(() => {
    if (!monthlySavings || monthlySavings <= 0) return null;
    return (Number(extraCost) || 0) / monthlySavings;
  }, [extraCost, monthlySavings]);

  // chart (24 months)
  const chartData = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        month: i + 1,
        savings: Math.max(0, (i + 1) * monthlySavings)
      })),
    [monthlySavings]
  );

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-3">💰 Cost Calculator</h3>

          <label className="block text-sm text-gray-600">Monthly distance (km)</label>
          <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value || 0))} className="w-full border p-2 rounded mb-3" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Petrol price (₹/L)</label>
              <input type="number" value={petrolPrice} onChange={(e) => setPetrolPrice(Number(e.target.value || 0))} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Petrol mileage (km/L)</label>
              <input type="number" value={petrolMileage} onChange={(e) => setPetrolMileage(Number(e.target.value || 0))} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-sm text-gray-600">Electricity rate (₹/kWh)</label>
              <input type="number" value={electricityRate} onChange={(e) => setElectricityRate(Number(e.target.value || 0))} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="text-sm text-gray-600">EV efficiency (km/kWh)</label>
              <input type="number" value={evEfficiency} onChange={(e) => setEvEfficiency(Number(e.target.value || 0))} className="w-full border p-2 rounded" />
            </div>
          </div>

          <label className="block text-sm text-gray-600 mt-3">Extra EV cost vs petrol (₹)</label>
          <input type="number" value={extraCost} onChange={(e) => setExtraCost(Number(e.target.value || 0))} className="w-full border p-2 rounded" />

          <div className="mt-4 bg-gray-50 border rounded p-3 text-center">[AdSense Placeholder - Calculator]</div>
        </div>

       <div className="space-y-8">

  {/* Monthly Comparison */}
  <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 
                  dark:from-gray-800 dark:via-gray-700 dark:to-gray-800
                  p-6 rounded-2xl shadow-md hover:shadow-xl transition">
    <h4 className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
      📊 Monthly Comparison
    </h4>
    <div className="mt-5 space-y-3">
      <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">Petrol cost</span>
        <span className="font-semibold text-red-600">₹{fmt(petrolCost,0)}</span>
      </div>
      <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">Electric cost</span>
        <span className="font-semibold text-green-600">₹{fmt(electricCost,0)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-300">Monthly savings</span>
        <span className="font-bold text-blue-600">₹{fmt(monthlySavings,0)}</span>
      </div>
    </div>
  </div>

  {/* Annual Savings */}
  <div className="bg-gradient-to-r from-green-50 via-emerald-100 to-teal-50
                  dark:from-gray-800 dark:via-gray-700 dark:to-gray-800
                  p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition">
    <div className="text-base font-semibold text-gray-700 dark:text-gray-200">💡 Annual Savings</div>
    <div className="text-5xl font-extrabold text-green-700 dark:text-green-400 mt-3 tracking-wide">
      ₹{fmt(annualSavings,0)}
    </div>
    <div className="text-sm text-gray-500 dark:text-gray-400 mt-3 italic">
      Estimate based on your inputs
    </div>
  </div>

  {/* Breakeven */}
  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50
                  dark:from-gray-800 dark:via-gray-700 dark:to-gray-800
                  p-6 rounded-2xl shadow-md hover:shadow-xl transition">
    <h4 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
      ⚖️ Breakeven
    </h4>
    {breakevenMonths ? (
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Months</span>
          <span className="text-purple-700 dark:text-purple-400 font-semibold">
            {fmt(breakevenMonths,1)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Years</span>
          <span className="text-purple-700 dark:text-purple-400 font-semibold">
            {fmt(breakevenMonths/12,2)}
          </span>
        </div>
      </div>
    ) : (
      <div className="text-sm text-gray-600 dark:text-gray-400 italic">
        No positive monthly savings → breakeven not reachable.
      </div>
    )}
  </div>

  {/* Cumulative Savings Chart */}
  <div className="bg-gradient-to-tr from-sky-50 via-indigo-50 to-violet-50 
                  dark:from-gray-800 dark:via-gray-700 dark:to-gray-800
                  p-6 rounded-2xl shadow-md hover:shadow-xl transition">
    <h4 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">
      📈 Cumulative savings (24 months)
    </h4>
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Line type="monotone" dataKey="savings" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400 italic">
      [AdSense Placeholder - Chart]
    </div>
  </div>

</div>


      {/* JSON-LD for FAQ (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is EV cheaper than petrol?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Use the calculator to compare costs. Results depend on distance, fuel/electricity prices, and vehicle efficiency."
                }
              },
              {
                "@type": "Question",
                "name": "How do I find EV charging stations near me?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Allow location access on the Charging Stations tab to view nearby EV chargers on the map."
                }
              }
            ]
          })
        }}
      />
    </section>
  );
}

// ----------------- ChargingStations (Leaflet + TomTom + local dump) -----------------
function ChargingStations() {
  const mapDivRef = useRef(null);
  const leafletRef = useRef(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({ lat: 12.9716, lng: 77.5946 }); // Bengaluru fallback

  // load static stations dump
  useEffect(() => {
    fetch('/data/stations.json')
      .then((r) => r.json())
      .then((data) => setStations((prev) => dedupeStations([...(prev || []), ...(Array.isArray(data) ? data : [])])))
      .catch(() => {});
  }, []);

  // get browser geolocation & then call TomTom proxy
  useEffect(() => {
    let mounted = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(coords);
        },
        () => {
          // permission denied → keep Bengaluru fallback
        },
        { timeout: 8000 }
      );
    }
    return () => { mounted = false; };
  }, []);

  // initialize leaflet and fetch TomTom proxy when we have a location
  useEffect(() => {
    let mounted = true;
    ensureLeafletCss();

    (async () => {
      const leafletModule = await import('leaflet');
      const L = leafletModule.default || leafletModule;
      // fix default icon urls when imported dynamically
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
      });

      if (!mounted) return;
      leafletRef.current = leafletRef.current || { L, map: null, markers: null };

      if (!leafletRef.current.map && mapDivRef.current) {
        const m = L.map(mapDivRef.current).setView([userLocation.lat, userLocation.lng], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(m);
        leafletRef.current.map = m;
        leafletRef.current.markers = L.layerGroup().addTo(m);
      }

      // fetch TomTom POIs using serverless proxy
      try {
        const res = await fetch(`/api/tomtom-proxy?lat=${userLocation.lat}&lon=${userLocation.lng}&radius=15000&limit=50`);
        const json = await res.json();
        const results = Array.isArray(json?.results) ? json.results : [];
        const mapped = results.map((s, i) => ({
          id: s.id || `tt-${i}`,
          name: s.poi?.name || 'EV Station',
          latitude: s.position?.lat,
          longitude: s.position?.lon,
          address: s.address?.freeformAddress || '',
          provider: s.poi?.brand || '',
          connectors: (s.poi?.categories || []).slice(0,3),
          power_kw: 0,
          source: 'tomtom'
        })).filter(x => Number.isFinite(x.latitude) && Number.isFinite(x.longitude));

        setStations(prev => dedupeStations([...(prev || []), ...mapped]));
      } catch (e) {
        // ignore TomTom errors silently — local stations still shown
        console.warn('TomTom proxy fetch failed', e);
      }

      setLoading(false);
    })();

    return () => { mounted = false; };
  }, [userLocation]);

  // update markers when stations change
  useEffect(() => {
    const ref = leafletRef.current;
    if (!ref || !ref.map || !ref.markers) return;
    ref.markers.clearLayers();
    const { L, markers, map } = ref;
    stations.slice(0, 200).forEach((s) => {
      const marker = L.marker([s.latitude, s.longitude]);
      marker.bindPopup(`<strong>${s.name}</strong><br/>${s.address || ''}`);
      marker.addTo(markers);
    });
    const pts = [userLocation, ...stations.slice(0, 30)].map(p => [p.latitude || p.lat || 0, p.longitude || p.lng || 0]);
    if (pts.length > 1) {
      try { map.fitBounds(pts, { padding: [40,40] }); } catch (e) {}
    }
  }, [stations, userLocation]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <h3 className="text-xl font-semibold">🔌 Charging Stations Near You</h3>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div ref={mapDivRef} style={{ height: 520 }} className="rounded-lg overflow-hidden border" />
          {loading && <p className="text-sm text-gray-600 mt-2">Loading stations…</p>}
          <div className="mt-2 text-xs text-gray-500">Tip: Allow location access for best results. If denied, map defaults to Bengaluru center.</div>
        </div>

        <aside className="bg-white border rounded-lg p-3 overflow-auto" style={{ maxHeight: 520 }}>
          <h4 className="font-semibold mb-2">Nearby Stations</h4>
          <ul className="space-y-2">
            {stations.slice(0,200).map(s => (
              <li key={`${s.source||'s'}-${s.id}`} className="border rounded p-2">
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-gray-600">{s.address}</div>
                <div className="text-xs mt-1">{(s.connectors || []).join(', ')} {s.power_kw ? `· ${s.power_kw} kW` : ''}</div>
              </li>
            ))}
            {stations.length === 0 && <li className="text-sm text-gray-600">No stations available.</li>}
          </ul>

          <div className="mt-4 bg-gray-100 p-3 text-center">[AdSense Placeholder - Map]</div>
        </aside>
      </div>
    </section>
  );
}

// ----------------- Subsidies -----------------
function Subsidies() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch('/data/subsidies.json')
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]));
  }, []);
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h3 className="text-xl font-semibold mb-4">🎁 State-wise EV Subsidies (snapshot)</h3>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((s, i) => (
          <div key={s.state || i} className="bg-white p-4 rounded-lg border">
            <div className="font-semibold">{s.state}</div>
            <div className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{s.details}</div>
            {s.source && <a className="text-xs text-blue-600 mt-2 inline-block" href={s.source} target="_blank" rel="noreferrer">Source</a>}
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-gray-600">Subsidy data not available.</div>}
      </div>

      <div className="mt-6 bg-gray-100 p-3 text-center">[AdSense Placeholder - Subsidies]</div>
    </section>
  );
}

// ----------------- Root App -----------------
export default function EVHelperApp() {
  const [active, setActive] = useState('calculator');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar active={active} setActive={setActive} />
      <main>
        {active === 'calculator' && <Calculator />}
        {active === 'stations' && <ChargingStations />}
        {active === 'subsidies' && <Subsidies />}
      </main>

      <footer className="text-center text-sm text-gray-500 py-6 mt-8">© 2025 EV Helper India</footer>
    </div>
  );
}
