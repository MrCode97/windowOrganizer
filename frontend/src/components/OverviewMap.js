// OverviewMap.js
import React from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';

function OverviewMap({ calendar_id}) {
  // variables to get from SQL request based on calendar id
  const window_coordinates_list = [[51.505, -0.09],[51.506, -0.0901],[51.510, -0.0904],[51.498, -0.0907]]

  // other variables
  // how to get dynamic icon with number inside?
  const icon_path = "https://www.pngall.com/wp-content/uploads/5/Christmas-Star-PNG-Picture-180x180.png"

  // calculate center coordinates
  // possible to adjust zoom level such that all Markers can be seen?
  let sumLatitude = 0;
  let sumLongitude = 0;
  for (const [latitude, longitude] of window_coordinates_list) {
    sumLatitude += latitude;
    sumLongitude += longitude;
  }
  const nr_markers = window_coordinates_list.length
  const center_coordinates = [sumLatitude / nr_markers, sumLongitude / nr_markers]
  
  return (
    <MapContainer center={center_coordinates} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "80%", margin: 20}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {window_coordinates_list.map((window_coordinates, index) => 
        <Marker position={window_coordinates} icon={new L.icon({ iconUrl: icon_path, iconSize: [32, 32]})}>
          <Popup>
             {index}. Dezember<br />
             Might want to include address and time.
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}

export default OverviewMap;