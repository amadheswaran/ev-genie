<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EV Helper – Charging Stations, Calculator & Subsidies</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(to bottom right, #e6f9f0, #f0f9ff);
    }
    .leaflet-container {
      border-radius: 1rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .logo-text {
      font-weight: 700;
      font-size: 1.2rem;
      color: #16a34a;
    }
  </style>
</head>
<body class="flex flex-col min-h-screen">

  <!-- Navbar -->
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
      <div class="flex items-center space-x-2">
        <!-- Logo -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 11V3a1 1 0 00-1-1H5a1 1 0 00-1 1v8h9zM4 15h16M10 21h4M17 17h.01" />
        </svg>
        <span class="logo-text">EV Helper</span>
      </div>
      <div class="space-x-6 text-gray-700 font-medium">
        <a href="#map" class="hover:text-green-600">Find Stations</a>
        <a href="#calculator" class="hover:text-green-600">Cost Calculator</a>
        <a href="#subsidies" class="hover:text-green-600">Subsidies</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <header class="text-center py-10 bg-gradient-to-r from-green-100 to-blue-100 shadow-sm">
    <h1 class="text-3xl md:text-4xl font-bold text-gray-800">Drive Electric, Save More 🚗⚡</h1>
    <p class="mt-3 text-gray-600">Find charging stations near you, calculate EV savings, and explore state subsidies</p>
  </header>

  <!-- Map Section -->
  <section id="map" class="max-w-6xl mx-auto px-4 py-10">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">🔌 Charging Stations Near You</h2>
    <div id="mapContainer" class="h-96 w-full"></div>
  </section>

  <!-- Calculator Section -->
  <section id="calculator" class="max-w-6xl mx-auto px-4 py-10">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">💰 EV Cost Savings Calculator</h2>
    <div class="bg-white p-6 rounded-2xl shadow-lg grid md:grid-cols-2 gap-6">
      <!-- Inputs -->
      <div>
        <label class="block mb-2 font-medium">Daily Distance (km)</label>
        <input type="number" id="distance" class="w-full p-2 border rounded-lg mb-4" placeholder="e.g. 40">

        <label class="block mb-2 font-medium">Fuel Price (₹/L)</label>
        <input type="number" id="fuelPrice" class="w-full p-2 border rounded-lg mb-4" placeholder="e.g. 100">

        <label class="block mb-2 font-medium">EV Efficiency (km/kWh)</label>
        <input type="number" id="efficiency" class="w-full p-2 border rounded-lg mb-4" placeholder="e.g. 6">

        <label class="block mb-2 font-medium">Electricity Cost (₹/kWh)</label>
        <input type="number" id="electricityCost" class="w-full p-2 border rounded-lg mb-4" placeholder="e.g. 8">

        <button onclick="calculateSavings()" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Calculate</button>
      </div>

      <!-- Results -->
      <div>
        <canvas id="savingsChart" class="mb-4"></canvas>
        <div id="result" class="p-4 bg-green-50 rounded-lg border border-green-200 text-green-800 font-semibold"></div>
      </div>
    </div>
  </section>

  <!-- Subsidies Section -->
  <section id="subsidies" class="max-w-6xl mx-auto px-4 py-10">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">📜 State EV Subsidies</h2>
    <div class="bg-white p-6 rounded-2xl shadow-lg">
      <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><b>Karnataka:</b> ₹10,000 subsidy on electric 2-wheelers</li>
        <li><b>Maharashtra:</b> ₹1.5 lakh subsidy on electric cars</li>
        <li><b>Delhi:</b> ₹30,000 subsidy on electric 2-wheelers</li>
        <li><b>Tamil Nadu:</b> Road tax exemption for EV buyers</li>
      </ul>
    </div>
  </section>

  <!-- Footer -->
  <footer class="mt-auto bg-gradient-to-r from-green-200 to-blue-200 text-gray-800 py-6 text-center">
    <p>&copy; 2025 EV Helper. All Rights Reserved.</p>
    <div class="space-x-4 mt-2 text-sm">
      <a href="#" class="hover:underline">About</a>
      <a href="#" class="hover:underline">Privacy</a>
      <a href="#" class="hover:underline">Terms</a>
    </div>
  </footer>

  <!-- Scripts -->
  <script>
    // Initialize Map
    const map = L.map('mapContainer').setView([12.9716, 77.5946], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Try geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 14);
        L.marker([latitude, longitude]).addTo(map).bindPopup("📍 You are here").openPopup();
      });
    }

    // Sample Stations
    const stations = [
      { name: "MG Road Charging Point", coords: [12.975, 77.605] },
      { name: "Indiranagar EV Station", coords: [12.978, 77.640] },
      { name: "Koramangala Fast Charger", coords: [12.935, 77.616] }
    ];
    stations.forEach(st => {
      L.marker(st.coords).addTo(map).bindPopup(`⚡ ${st.name}`);
    });

    // Calculator Logic
    function calculateSavings() {
      const d = parseFloat(document.getElementById('distance').value);
      const f = parseFloat(document.getElementById('fuelPrice').value);
      const e = parseFloat(document.getElementById('efficiency').value);
      const c = parseFloat(document.getElementById('electricityCost').value);

      if (!(d && f && e && c)) {
        document.getElementById('result').innerText = "⚠️ Please enter all fields";
        return;
      }

      const monthlyFuel = (d / 15) * f * 30; // assuming 15 km/l
      const monthlyEV = (d / e) * c * 30;
      const savings = monthlyFuel - monthlyEV;

      document.getElementById('result').innerText = `You save ₹${savings.toFixed(0)} per month by driving an EV!`;

      const ctx = document.getElementById('savingsChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: 12 }, (_, i) => `Month ${i+1}`),
          datasets: [{
            label: 'Cumulative Savings (₹)',
            data: Array.from({ length: 12 }, (_, i) => (savings * (i+1)).toFixed(0)),
            borderColor: 'green',
            backgroundColor: 'rgba(34,197,94,0.2)',
            fill: true,
            tension: 0.3
          }]
        },
        options: { responsive: true, plugins: { legend: { display: true } } }
      });
    }
  </script>
</body>
</html>
