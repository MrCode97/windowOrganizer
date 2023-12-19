import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet';

const DrawMap = ({ coordinates }) => {
  if (coordinates.length > 0) {
    return (
      <MapContainer center={[coordinates[0].x, coordinates[0].y]} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "80%"}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates[0].x, coordinates[0].y]} icon={new L.icon({
          iconUrl: require('../assets/staricons/star.png'),
          iconSize: [32, 32],})}
        >
        </Marker>
      </MapContainer>
    );
  } else {
    return (
      <></>
    );
  }
};

export default DrawMap;