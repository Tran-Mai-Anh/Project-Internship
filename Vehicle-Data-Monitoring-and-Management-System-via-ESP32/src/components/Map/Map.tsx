import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import car from "../../assets/car_running.svg";
import motorbike from "../../assets/motorbike.png";

type MapProps = {
  position: [number, number] | null;
  vehicleType: string;
};

const carIcon = new L.Icon({
  iconUrl: car,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const bikeIcon = new L.Icon({
  iconUrl: motorbike,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const Map = ({ position, vehicleType }: MapProps) => {
  if (!position) return <p>Hãy chọn xe để xem vị trí...</p>;

  const selectedIcon = vehicleType === "car" ? carIcon : bikeIcon;
  console.log(vehicleType);
  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
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
