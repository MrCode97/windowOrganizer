// OverviewMap.js
import React, { useCallback, useState, useEffect  } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

function OverviewMap({ calendar_id, reRender }) {
  const [calendarMapInfos, setCalendarMapInfos] = useState([]);

  // Make an API request to fetch calendar infos based on calendar_id
  const fetchCalendarMapInfo = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:7007/api/calendarMapInfo?calendar_id=${calendar_id}`);
      const data = await response.json();
      setCalendarMapInfos(data.calendarMapInfos);
    } catch (error) {
      console.error('Error fetching calendar info:', error);
    }
  }, [calendar_id]);

  // Fetch calendar map info from the backend when the component mounts
  useEffect(() => {
    fetchCalendarMapInfo();
  }, [fetchCalendarMapInfo, reRender]);

  // Calculate average of all window coordinates to set center of map
  const calculateCenter = () => {
    let sumLatitude = 0;
    let sumLongitude = 0;
    const nr_markers = calendarMapInfos.length;
    if (nr_markers > 0 ) {
      for (const window of calendarMapInfos) {
        sumLatitude += window.address.x;
        sumLongitude += window.address.y;
      }
      return [sumLatitude / nr_markers, sumLongitude / nr_markers];
    }
    return [];
  }

  if (calendarMapInfos.length > 0) {
    return (
      <MapContainer
        center={calculateCenter()}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "300px", width: "80%", margin: 20 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {calendarMapInfos.length === 0 ? <></> : calendarMapInfos.map((window, index) => (
          <Marker key={index} position={[window.address.x, window.address.y]} icon={new L.icon({
            iconUrl: require('../assets/staricons/' + window.window_nr + '.png'),
            iconSize: [32, 32],})}
          >
            <Popup>
              {<div>{window.window_nr}. Dezember, {window.time}<br />{window.address_name}</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    )
  } else {
    return (
      <></>
    )
  }
}

export default OverviewMap;