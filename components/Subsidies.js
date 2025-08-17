// components/Subsidies.js
import { useState } from "react";

const subsidiesData = {
  Karnataka: "EV buyers get up to ₹1.5 lakh subsidy + road tax exemption.",
  Maharashtra: "Subsidy up to ₹2.5 lakh for EVs, scrappage incentive included.",
  Delhi: "₹10,000 per kWh subsidy, max ₹1.5 lakh + registration waived.",
  TamilNadu: "Road tax exemption + state EV policy benefits.",
  Gujarat: "₹10,000 per kWh, max subsidy ₹1.5 lakh.",
};

export default function Subsidies() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">State-wise EV Subsidies</h2>
      <div className="space-y-2">
        {Object.entries(subsidiesData).map(([state, info]) => (
          <div
            key={state}
            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setSelected(selected === state ? null : state)}
          >
            <div className="font-semibold">{state}</div>
            {selected === state && <p className="mt-2 text-sm">{info}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
