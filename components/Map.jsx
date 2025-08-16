// /components/Map.jsx
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ stations = [] }) {
  useEffect(() => {
    // Create the map
    const map = L.map("map").setView([20.5937, 78.9629], 5); // Default: India center

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Try geolocation to center on user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 13);
        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup("📍 You are here")
          .openPopup();
      });
    }

    // Add charging station markers
    stations.forEach((station) => {
      if (station.lat && station.lng) {
        L.marker([station.lat, station.lng])
          .addTo(map)
          .bindPopup(`<b>${station.name}</b><br/>${station.address || ""}`);
      }
    });

    return () => {
      map.remove();
    };
  }, [stations]);

  return (
    <div
      id="map"
      style={{ height: "500px", width: "100%", borderRadius: "12px" }}
    ></div>
  );
}
