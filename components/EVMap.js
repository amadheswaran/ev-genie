// components/EVMap.js
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const stationIcon = new L.Icon({
  iconUrl: "/station.png", // place a marker icon in /public
  iconSize: [30, 30],
});

const fallbackCenter = [12.9716, 77.5946]; // Bengaluru center

export default function EVMap() {
  const [position, setPosition] = useState(fallbackCenter);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => setPosition(fallbackCenter) // fallback
      );
    }
  }, []);

  // Example real stations (later replace with JSON / API)
  const stations = [
    { id: 1, name: "MG Road Charger", coords: [12.9756, 77.6050] },
    { id: 2, name: "Koramangala EV Hub", coords: [12.9279, 77.6271] },
    { id: 3, name: "Whitefield Charging Plaza", coords: [12.9698, 77.7500] },
  ];

  return (
    <div className="h-[70vh] w-full rounded-2xl overflow-hidden shadow-lg border">
      <MapContainer center={position} zoom={13} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations.map((s) => (
          <Marker key={s.id} position={s.coords} icon={stationIcon}>
            <Popup>{s.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
