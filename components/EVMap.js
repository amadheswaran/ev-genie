import { useEffect } from "react";
import L from "leaflet";

export default function EVMap() {
  useEffect(() => {
    const map = L.map("mapContainer").setView([12.9716, 77.5946], 12); // Bengaluru center

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Try locating user
    map.locate({ setView: true, maxZoom: 14 });

    // Add markers (demo stations)
    const stations = [
      { lat: 12.9716, lng: 77.5946, name: "MG Road Charger" },
      { lat: 12.9352, lng: 77.6245, name: "Koramangala Charger" },
      { lat: 12.9981, lng: 77.5921, name: "Yeshwanthpur Charger" },
    ];
    stations.forEach(station => {
      L.marker([station.lat, station.lng]).addTo(map).bindPopup(station.name);
    });
  }, []);

  return <div id="mapContainer" className="h-96 w-full rounded-lg shadow-md"></div>;
}
