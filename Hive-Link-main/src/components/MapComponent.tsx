import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import "leaflet-routing-machine"; // Import routing machine

declare module "leaflet" {
  namespace Routing {
    function control(options: any): any;
  }
}

const MapComponent: React.FC = () => {
  //  State to store user's live location
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
  //  State for destination
  const [destination, setDestination] = useState<LatLngExpression | null>(null);
  //  State for input values
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  //  Fetch user's live location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => console.error("Error getting location: ", error),
      { enableHighAccuracy: true }
    );
  }, []);

  //  Function to update destination based on input
  const handleSetDestination = () => {
    if (!lat || !lng) return alert("Please enter valid coordinates!");
    setDestination([parseFloat(lat), parseFloat(lng)]);
  };

  return (
    <div>
      {/*  Input fields for coordinates */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          style={{ marginRight: "5px" }}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
        />
        <button onClick={handleSetDestination} style={{ marginLeft: "5px" }}>Set Destination</button>
      </div>

      {/*  Map Container */}
      <MapContainer
        center={userLocation || [28.6139, 77.2090]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/*  Show user's current location */}
        {userLocation && (
          <Marker position={userLocation} icon={customIcon}>
            <Popup>You are here!</Popup>
          </Marker>
        )}

        {/*  Show destination marker */}
        {destination && (
          <Marker position={destination} icon={destinationIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {/*  Draw route when destination is set */}
        {destination && userLocation && <Routing userLocation={userLocation} destination={destination} />}
      </MapContainer>
    </div>
  );
};

// ✅ Custom Icons for Better UI
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Example: Blue location icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684809.png", // Example: Red destination icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// 📌 Routing Component
const Routing: React.FC<{ userLocation: LatLngExpression; destination: LatLngExpression }> = ({
  userLocation,
  destination,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !destination) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(userLocation), L.latLng(destination)],
      routeWhileDragging: true,
      createMarker: () => null, // Avoid duplicate markers
      lineOptions: {
        styles: [{ color: "blue", weight: 6 }],
      },
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [userLocation, destination, map]);

  return null;
};

export default MapComponent;
