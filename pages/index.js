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
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⚡</div>
          <div>
            <div className="font-bold text-lg">EV Helper</div>
            <div className="text-xs opacity-80">Stations · Subsidies · Savings</div>
          </div>
        </div>

        <nav className="flex gap-2">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => setActive(it.id)}
              className={`px-3 py-2 rounded-lg transition ${
                active === it.id
                  ? 'bg-white text-blue-700 font-semibold shadow'
                  : 'hover:bg-white/20'
              }`}
            >
              <span className="mr-1">{it.emoji}</span>
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
  const [distance, setDistance] = useState(1000);
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

  const chartData = Array.from({ length: 24 }, (_, i) => ({
    month: i + 1,
    savings: Math.max(0, (i + 1) * monthlySavings)
  }));

  const inputStyle =
    'w-full border p-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition';

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">💰 Cost Calculator</h3>

          <label className="block text-sm text-gray-600">Monthly distance (km)</label>
          <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value || 0))} className={inputStyle + " mb-3"} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Petrol price (₹/L)</label>
              <input type="number" value={petrolPrice} onChange={(e) => setPetrolPrice(Number(e.target.value || 0))} className={inputStyle} />
            </div>
            <div>
              <label className="text-sm text-gray-600">Petrol mileage (km/L)</label>
              <input type="number" value={petrolMileage} onChange={(e) => setPetrolMileage(Number(e.target.value || 0))} className={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-sm text-gray-600">Electricity rate (₹/kWh)</label>
              <input type="number" value={electricityRate} onChange={(e) => setElectricityRate(Number(e.target.value || 0))} className={inputStyle} />
            </div>
            <div>
              <label className="text-sm text-gray-600">EV efficiency (km/kWh)</label>
              <input type="number" value={evEfficiency} onChange={(e) => setEvEfficiency(Number(e.target.value || 0))} className={inputStyle} />
            </div>
          </div>

          <label className="block text-sm text-gray-600 mt-3">Extra EV cost vs petrol (₹)</label>
          <input type="number" value={extraCost} onChange={(e) => setExtraCost(Number(e.target.value || 0))} className={inputStyle} />

          <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border rounded-xl p-3 text-center text-gray-500">[AdSense Placeholder - Calculator]</div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <h4 className="text-sm text-gray-500">Monthly comparison</h4>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between"><span className="text-sm">Petrol cost</span><span className="font-medium text-red-600">₹{fmt(petrolCost,0)}</span></div>
              <div className="flex justify-between"><span className="text-sm">Electric cost</span><span className="font-medium text-green-600">₹{fmt(electricCost,0)}</span></div>
              <div className="flex justify-between"><span className="text-sm">Monthly savings</span><span className="font-bold text-blue-600">₹{fmt(monthlySavings,0)}</span></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow text-center">
            <div className="text-sm text-gray-600">Annual savings</div>
            <div className="text-3xl font-bold text-green-700 mt-2">₹{fmt(annualSavings,0)}</div>
            <div className="text-xs text-gray-500 mt-2">Estimate based on inputs</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <h4 className="text-sm text-gray-600 mb-2">⚖️ Breakeven</h4>
            {breakevenMonths ? (
              <>
                <div className="flex justify-between"><span>Months</span><span className="text-purple-600 font-medium">{fmt(breakevenMonths,1)}</span></div>
                <div className="flex justify-between"><span>Years</span><span className="text-purple-600 font-medium">{fmt(breakevenMonths/12,2)}</span></div>
              </>
            ) : (
              <div className="text-sm text-gray-600">No positive monthly savings → breakeven not reachable.</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
        <h4 className="text-sm text-gray-500 mb-3">Cumulative savings (24 months)</h4>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="savings"
              stroke="url(#colorSavings)"
              strokeWidth={3}
              dot={false}
            />
            <defs>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border rounded-xl p-3 text-center text-gray-500">[AdSense Placeholder - Chart]</div>
      </div>
    </section>
  );
}
