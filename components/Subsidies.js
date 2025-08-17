export default function Subsidies() {
  const subsidies = [
    { state: "Karnataka", subsidy: "₹10,000 per EV (2W), ₹50,000 (4W)" },
    { state: "Delhi", subsidy: "Up to ₹30,000 (2W), ₹1.5L (4W)" },
    { state: "Maharashtra", subsidy: "₹5,000/kWh up to ₹1.5L" },
    { state: "Tamil Nadu", subsidy: "Road tax & registration fee waived" },
  ];

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <ul className="list-disc pl-6 space-y-2">
        {subsidies.map((s, idx) => (
          <li key={idx}>
            <strong>{s.state}:</strong> {s.subsidy}
          </li>
        ))}
      </ul>
    </div>
  );
}
