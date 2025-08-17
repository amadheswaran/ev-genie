<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EV Helper</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%2300b894'/%3E%3Cpath d='M9 12l2-6 2 6-2 6z' fill='white'/%3E%3C/svg%3E">
  <style>
    body { transition: background 0.3s, color 0.3s; }
  </style>
</head>
<body class="bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
  <!-- Navbar -->
  <nav class="bg-white dark:bg-gray-800 shadow-md fixed w-full z-10 top-0">
    <div class="container mx-auto flex justify-between items-center px-4 py-3">
      <div class="flex items-center space-x-2">
        <!-- Logo -->
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%2300b894'/%3E%3Cpath d='M9 12l2-6 2 6-2 6z' fill='white'/%3E%3C/svg%3E" alt="EV Logo" class="w-8 h-8">
        <span class="font-bold text-lg">EV Helper</span>
      </div>
      <!-- Menu + Dark mode toggle -->
      <div class="flex items-center space-x-4">
        <a href="#calculator" class="hover:text-green-500">Calculator</a>
        <a href="#stations" class="hover:text-green-500">Stations</a>
        <a href="#subsidies" class="hover:text-green-500">Subsidies</a>
        <!-- Dark Mode Toggle -->
        <button id="darkToggle" class="p-2 rounded-md bg-gray-200 dark:bg-gray-700">
          🌙
        </button>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="pt-24 pb-12 text-center bg-gradient-to-r from-green-400 to-blue-500 text-white">
    <h1 class="text-4xl font-bold">Your One-stop EV Companion</h1>
    <p class="mt-2 text-lg">Calculate savings, find stations, and explore subsidies</p>
  </section>

  <!-- Calculator -->
  <section id="calculator" class="py-12 container mx-auto px-4">
    <h2 class="text-2xl font-bold mb-4">EV vs Petrol Calculator</h2>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
        <label class="block mb-2">Daily Distance (km):</label>
        <input id="distance" type="number" class="w-full border rounded p-2 mb-4 dark:bg-gray-700"/>
        <label class="block mb-2">Fuel Price (₹/L):</label>
        <input id="fuelPrice" type="number" value="105" class="w-full border rounded p-2 mb-4 dark:bg-gray-700"/>
        <label class="block mb-2">EV Efficiency (km/kWh):</label>
        <input id="efficiency" type="number" value="6" class="w-full border rounded p-2 mb-4 dark:bg-gray-700"/>
        <label class="block mb-2">Electricity Cost (₹/kWh):</label>
        <input id="electricity" type="number" value="8" class="w-full border rounded p-2 mb-4 dark:bg-gray-700"/>
        <button onclick="calculate()" class="mt-4 w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">Calculate</button>
      </div>
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 flex flex-col items-center justify-center">
        <p id="result" class="text-xl font-bold">Enter values to see savings</p>
        <canvas id="savingsChart" class="mt-6 w-full"></canvas>
      </div>
    </div>
  </section>

  <!-- Stations -->
  <section id="stations" class="py-12 container mx-auto px-4">
    <h2 class="text-2xl font-bold mb-4">Nearby EV Charging Stations</h2>
    <div id="map" class="h-96 rounded-xl shadow-md"></div>
  </section>

  <!-- Subsidies -->
  <section id="subsidies" class="py-12 container mx-auto px-4">
    <h2 class="text-2xl font-bold mb-4">EV State-wise Subsidies</h2>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
        <h3 class="font-semibold">Karnataka</h3>
        <p>Subsidy up to ₹20,000 for electric 2-wheelers</p>
      </div>
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
        <h3 class="font-semibold">Delhi</h3>
        <p>Subsidy up to ₹30,000 for 2-wheelers, ₹1.5L for 4-wheelers</p>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-6 text-center bg-gradient-to-r from-green-400 to-blue-500 text-white mt-12">
    <p>© 2025 EV Helper. All rights reserved.</p>
  </footer>

  <!-- Scripts -->
  <script>
    // Dark mode toggle
    const toggle = document.getElementById("darkToggle");
    toggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
    });

    // Calculator
    let chart;
    function calculate() {
      const d = parseFloat(document.getElementById("distance").value) || 0;
      const f = parseFloat(document.getElementById("fuelPrice").value) || 0;
      const e = parseFloat(document.getElementById("efficiency").value) || 1;
      const c = parseFloat(document.getElementById("electricity").value) || 0;

      const petrolCost = d / 15 * f;
      const evCost = d / e * c;
      const savings = petrolCost - evCost;

      document.getElementById("result").innerText = `Daily Savings: ₹${savings.toFixed(2)}`;

      const ctx = document.getElementById("savingsChart").getContext("2d");
      if (chart) chart.destroy();
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: Array.from({length: 12}, (_, i) => `Month ${i+1}`),
          datasets: [{
            label: "Cumulative Savings (₹)",
            data: Array.from({length: 12}, (_, i) => (savings*30*(i+1)).toFixed(2)),
            borderColor: "#10B981",
            backgroundColor: "rgba(16,185,129,0.2)",
            fill: true
          }]
        }
      });
    }

    // Map
    const map = L.map("map").setView([12.9716, 77.5946], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    const stations = [
      {name: "MG Road Charger", lat: 12.975, lng: 77.606},
      {name: "Indiranagar EV Point", lat: 12.978, lng: 77.640},
      {name: "Whitefield FastCharge", lat: 12.969, lng: 77.75}
    ];
    stations.forEach(s => {
      L.marker([s.lat, s.lng]).addTo(map).bindPopup(s.name);
    });
  </script>
</body>
</html>
