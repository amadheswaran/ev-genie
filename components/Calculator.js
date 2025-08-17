import { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js";

export default function Calculator() {
  const [petrolCost, setPetrolCost] = useState(100000);
  const [evCost, setEvCost] = useState(120000);
  const [kmPerMonth, setKmPerMonth] = useState(1000);
  const [savingsPerKm, setSavingsPerKm] = useState(3); // ₹3/km savings
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const breakevenKm = Math.ceil((evCost - petrolCost) / savingsPerKm);
  const breakevenMonths = Math.ceil(breakevenKm / kmPerMonth);

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: 13 }, (_, i) => `${i} yr`),
        datasets: [
          {
            label: "Cumulative EV Savings (₹)",
            data: Array.from({ length: 13 }, (_, i) => i * 12 * kmPerMonth * savingsPerKm),
            borderColor: "green",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
    });
  }, [kmPerMonth, savingsPerKm]);

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <input type="number" value={petrolCost} onChange={e => setPetrolCost(+e.target.value)} className="border p-2 rounded" placeholder="Petrol Car Cost" />
        <input type="number" value={evCost} onChange={e => setEvCost(+e.target.value)} className="border p-2 rounded" placeholder="EV Car Cost" />
        <input type="number" value={kmPerMonth} onChange={e => setKmPerMonth(+e.target.value)} className="border p-2 rounded" placeholder="Km per Month" />
        <input type="number" value={savingsPerKm} onChange={e => setSavingsPerKm(+e.target.value)} className="border p-2 rounded" placeholder="Savings per Km" />
      </div>
      <div className="mt-4">
        <p className="font-semibold">⚡ Breakeven: {breakevenKm} km (~{breakevenMonths} months)</p>
      </div>
      <canvas ref={chartRef} className="mt-6"></canvas>
    </div>
  );
}
