import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import React, { useCallback, useState, useEffect  } from 'react';



const DrawMap = ({ coordinatesList, iconPath, drawNumbers }) => {
  const [centerCoordinates, setCenterCoordinates] = useState([]);

  const calculateCenter = () => {
    let sumLatitude = 0;
    let sumLongitude = 0;
    const nr_markers = coordinatesList.length;
    if (nr_markers > 0 ) {
      for (const coordinates of coordinatesList) {
        sumLatitude += coordinates.x;
        sumLongitude += coordinates.y;
      }
      setCenterCoordinates([sumLatitude / nr_markers, sumLongitude / nr_markers]);
    }
  }

  useEffect(() => {
    calculateCenter();
  }, [coordinatesList]);


  if (centerCoordinates.length > 0) {
    return (
      <MapContainer center={centerCoordinates} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "80%", margin: 20 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinatesList.length == 0 ? <></> : coordinatesList.map((point, index) => (
          <Marker key={index} position={[point.x, point.y]} icon={new L.icon({ iconUrl: iconPath, iconSize: [32, 32] })}>
            <Popup>
              {/* {drawNumbers && <div>{index}. Dezember<br /></div>} */}
              {/* Need to get index from window nr */}
              {/* Add additional details here if needed */}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  } else {
    return (
      <></>
    );
  }
};

export default DrawMap;