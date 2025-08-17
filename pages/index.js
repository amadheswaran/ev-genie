// pages/index.js
'use client';

import React, { useState } from 'react';
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
      {/* Form and results */}
      {/* ... existing Calculator JSX ... */}
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
      </div>
    </section>
  );
}

// ----------------- Page Component -----------------
export default function HomePage() {
  const [active, setActive] = useState('calculator');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar active={active} setActive={setActive} />
      {active === 'calculator' && <Calculator />}
      {active === 'stations' && (
        <div className="max-w-6xl mx-auto px-4 py-8">🔌 Charging Stations (coming soon)</div>
      )}
      {active === 'subsidies' && (
        <div className="max-w-6xl mx-auto px-4 py-8">🎁 Subsidies (coming soon)</div>
      )}
    </div>
  );
}
