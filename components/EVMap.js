import { useEffect, useState } from "react";

let MapContainer, TileLayer, Marker, Popup;

if (typeof window !== "undefined") {
  // Import only in client-side
  const RL = require("react-leaflet");
  MapContainer = RL.MapContainer;
  TileLayer = RL.TileLayer;
  Marker = RL.Marker;
  Popup = RL.Popup;

  require("leaflet/dist/leaflet.css");
}

export default function EVMap() {
  const [center, setCenter] = useState([12.9716, 77.5946]); // Default: Bengaluru

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setCenter([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          setCenter([12.9716, 77.5946]); // fallback Bengaluru
        }
      );
    }
  }, []);

  if (!MapContainer) return <p>Loading map...</p>;

  return (
    <div className="h-[500px] w-full rounded-lg shadow">
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={center}>
          <Popup>You are here 🚗⚡</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
