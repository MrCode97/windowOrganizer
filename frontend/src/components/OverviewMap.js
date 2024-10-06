// OverviewMap.js
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

function OverviewMap({ calendar_id, locationAdded }) {
  const [calendarMapInfos, setCalendarMapInfos] = useState([]);

  useEffect(() => {
    const fetchCalendarMapInfo = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/locations?calendar_id=${calendar_id}`);
        const data = await response.json();
        setCalendarMapInfos(data.calendarMapInfos);
      } catch (error) {
        console.error('Error fetching calendar info:', error);
      }
    }
    fetchCalendarMapInfo();
  }, [calendar_id, locationAdded])

  // Calculate average of all window coordinates to set center of map
  const calculateCenter = () => {
    let sumLatitude = 0;
    let sumLongitude = 0;
    const nr_markers = calendarMapInfos.length;
    if (nr_markers > 0) {
      for (const window of calendarMapInfos) {
        sumLatitude += window.address.x;
        sumLongitude += window.address.y;
      }
      return [sumLatitude / nr_markers, sumLongitude / nr_markers];
    }
    return [];
  }

  return (
    <>
      {calendarMapInfos.length > 0 && (
        <MapContainer
          center={calculateCenter()}
          zoom={13}
          scrollWheelZoom={false}
          style={{
            height: "300px",
            width: "80%",
            margin: 20,
            border: '2px solid #D4AF37',
            borderRadius: '10px', 
            boxShadow: '0px 0px 5px rgba(255, 215, 0, 0.8)',
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {calendarMapInfos.map((window, index) => (
            <Marker
              key={index}
              position={[window.address.x, window.address.y]}
              icon={new L.icon({
                iconUrl: require('../assets/staricons/' + window.window_nr + '.png'),
                iconSize: [32, 32],
              })}
            >
              <Popup>
                <div>
                  {window.window_nr}. Dezember, {window.time}
                  <br />
                  {window.address_name}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

    </>

  )

}

export default OverviewMap;