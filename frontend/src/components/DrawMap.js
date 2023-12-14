import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';



const DrawMap = ({ center, coordinatesList, iconPath, drawNumbers }) => {
  console.log("DrawMap coordinatesList:", coordinatesList);
  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "80%", margin: 20 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coordinatesList.map((coordinates) => (
        <Marker position={[coordinates.x, coordinates.y]} icon={new L.icon({ iconUrl: iconPath, iconSize: [32, 32] })}>
          <Popup>
            {/* {drawNumbers && <div>{index}. Dezember<br /></div>} */}
            {/* Need to get index from window nr */}
            {/* Add additional details here if needed */}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DrawMap;