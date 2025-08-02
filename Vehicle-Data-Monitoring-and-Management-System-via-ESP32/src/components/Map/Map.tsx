// Map.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

type MapProps = {
  position: [number, number] | null;
  vehicleType: string; // 'car' hoặc 'motorcycle'
};

const carIcon = new L.Icon({
  iconUrl: '/car-icon.png', // Đường dẫn ảnh icon ô tô
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const bikeIcon = new L.Icon({
  iconUrl: '/bike-icon.png', // Đường dẫn ảnh icon xe máy
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const Map = ({ position, vehicleType }: MapProps) => {
  if (!position) return <p>Hãy chọn xe để xem vị trí...</p>;

  const selectedIcon = vehicleType === 'car' ? carIcon : bikeIcon;

  return (
    <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={selectedIcon}>
        <Popup>Vị trí xe hiện tại</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
