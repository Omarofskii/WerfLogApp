import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { WerfItem } from "../data/mockData";
import { Button } from "./ui/button";
import { Target } from "lucide-react";

// Fix default icon paths for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom marker icons based on priority and status
function getMarkerIcon(item: WerfItem): L.DivIcon {
  const isOverdue = item.status !== "voltooid" && item.deadline < new Date();
  const color = isOverdue
    ? "#dc2626"
    : item.prioriteit === 5
    ? "#dc2626"
    : item.prioriteit === 4
    ? "#f97316"
    : item.prioriteit === 3
    ? "#eab308"
    : item.prioriteit === 2
    ? "#3b82f6"
    : "#6b7280";

  const statusIcon =
    item.status === "voltooid"
      ? "✓"
      : item.status === "in uitvoering"
      ? "◐"
      : isOverdue
      ? "!"
      : "";

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 16px;
        ">${statusIcon}</span>
      </div>
    `,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

interface ProjectMapProps {
  items: WerfItem[];
  center: [number, number];
  onItemClick: (item: WerfItem) => void;
  onMapClick: (lat: number, lng: number) => void;
  isPlacementMode?: boolean;
}

export function ProjectMap({ items, center, onItemClick, onMapClick, isPlacementMode }: ProjectMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(center, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Handle map clicks
    map.on("click", (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when items change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    items.forEach((item) => {
      const marker = L.marker([item.latitude, item.longitude], {
        icon: getMarkerIcon(item),
      }).addTo(mapInstanceRef.current!);

      marker.on("click", () => {
        onItemClick(item);
      });

      const popupContent = `
        <div style="padding: 8px;">
          <h3 style="font-weight: 600; margin-bottom: 4px;">${item.titel}</h3>
          <p style="font-size: 14px; color: #666; margin-bottom: 8px;">${item.adresLocatie}</p>
          <span style="
            display: inline-block;
            padding: 2px 8px;
            background: ${item.status === "voltooid" ? "#e5e7eb" : item.status === "in uitvoering" ? "#3b82f6" : "#fff"};
            color: ${item.status === "voltooid" ? "#374151" : item.status === "in uitvoering" ? "#fff" : "#374151"};
            border: ${item.status === "uit te voeren" ? "1px solid #d1d5db" : "none"};
            border-radius: 4px;
            font-size: 12px;
          ">${item.status}</span>
        </div>
      `;

      marker.bindPopup(popupContent);

      markersRef.current.push(marker);
    });
  }, [items, onItemClick]);

  // Track user location
  useEffect(() => {
    if (!mapInstanceRef.current || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const pos: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(pos);

        // Update or create user location marker
        if (mapInstanceRef.current) {
          const userIcon = L.divIcon({
            html: `
              <div style="
                background-color: #3b82f6;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
              "></div>
            `,
            className: "",
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          // Remove old user marker if exists
          const existingUserMarker = (mapInstanceRef.current as any)._userLocationMarker;
          if (existingUserMarker) {
            existingUserMarker.remove();
          }

          // Add new user marker
          const userMarker = L.marker(pos, { icon: userIcon }).addTo(mapInstanceRef.current);
          (mapInstanceRef.current as any)._userLocationMarker = userMarker;
        }
      },
      () => {
        // Silently ignore - geolocation may be disabled in iframe/embedded contexts
        // User can still use "Centreer op mij" button which will show appropriate message
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const handleCenterOnUser = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setView(userLocation, 16);
    } else {
      alert("Locatie niet beschikbaar. Controleer je toestemmingen.");
    }
  };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className={`w-full h-full ${isPlacementMode ? 'cursor-crosshair' : ''}`}
      />
      
      {isPlacementMode && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold">
          Klik op de kaart om een nieuwe pin te plaatsen
        </div>
      )}
      
      <Button
        onClick={handleCenterOnUser}
        size="lg"
        className="absolute bottom-6 left-6 z-[1000] shadow-lg"
        variant="secondary"
      >
        <Target className="size-5 mr-2" />
        Centreer op mij
      </Button>
    </div>
  );
}