// OverviewMap.js
import React from 'react';
import "leaflet/dist/leaflet.css";
import DrawMap from './DrawMap';

function OverviewMap({ calendar_id}) {
  // variables to get from SQL request based on calendar id
  const window_coordinates_list = [[51.505, -0.09],[51.506, -0.0901],[51.510, -0.0904],[51.498, -0.0907]]

  // other variables
  // how to get dynamic icon with number inside?
  // Ich würde säge mer nehmed uf pngall en adventskalender bild und schnided die 24 törli use, speichered sie einzeln im backend
  // und fetched sie dynamically
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
  <DrawMap center={center_coordinates} coordinatesList={window_coordinates_list} iconPath={icon_path} drawNumbers={true} />
  )
}

export default OverviewMap;