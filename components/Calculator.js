// components/Calculator.js
import { useState } from "react";

export default function Calculator() {
  const [distance, setDistance] = useState("");
  const [petrolCost, setPetrolCost] = useState("");
  const [evCost, setEvCost] = useState("");
  const [savings, setSavings] = useState(null);

  const calculate = () => {
    if (!distance || !petrolCost || !evCost) return;
    const petrolExpense = distance * petrolCost;
    const evExpense = distance * evCost;
    setSavings(petrolExpense - evExpense);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">EV Savings Calculator</h2>
      <div className="space-y-3">
        <input
          type="number"
          placeholder="Distance (km)"
          className="w-full p-2 rounded border dark:bg-gray-700"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
        <input
          type="number"
          placeholder="Petrol Cost per km"
          className="w-full p-2 rounded border dark:bg-gray-700"
          value={petrolCost}
          onChange={(e) => setPetrolCost(e.target.value)}
        />
        <input
          type="number"
          placeholder="EV Cost per km"
          className="w-full p-2 rounded border dark:bg-gray-700"
          value={evCost}
          onChange={(e) => setEvCost(e.target.value)}
        />
        <button
          onClick={calculate}
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
        >
          Calculate Savings
        </button>
      </div>
      {savings !== null && (
        <p className="mt-4 text-center font-medium">
          You save <span className="font-bold text-green-600">₹{savings}</span> on this trip 🚗⚡
        </p>
      )}
    </div>
  );
}
