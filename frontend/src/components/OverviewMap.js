// OverviewMap.js
import React, { useCallback, useState, useEffect  } from 'react';
import "leaflet/dist/leaflet.css";
import DrawMap from './DrawMap';

function OverviewMap({ calendar_id }) {
  // variables to get from SQL request based on calendar id
  const [calendarMapInfos, setCalendarMapInfos] = useState([]);

  // Make an API request to fetch calendar infos based on calendar_id
  const fetchCalendarMapInfo = useCallback(async () => {
    try {
      console.log("Calendar id is: " + calendar_id);
      const response = await fetch(`http://localhost:7007/api/calendarMapInfo?calendar_id=${calendar_id}`);
      const data = await response.json();
      console.log("Received info:", data.calendarMapInfos);
      setCalendarMapInfos(data.calendarMapInfos);
      console.log("Inside fetch:", calendarMapInfos);
    } catch (error) {
      console.error('Error fetching calendar info:', error);
    }
  }, [calendar_id]);

  // Fetch calendar map info from the backend when the component mounts
  useEffect(() => {
    fetchCalendarMapInfo();
    console.log("Inside useEffect:", calendarMapInfos);
  }, [fetchCalendarMapInfo /* other dependencies if needed */]);

  // other variables
  // how to get dynamic icon with number inside?
  // Ich würde säge mer nehmed uf pngall en adventskalender bild und schnided die 24 törli use, speichered sie einzeln im backend
  // und fetched sie dynamically
  const icon_path = "https://www.pngall.com/wp-content/uploads/5/Christmas-Star-PNG-Picture-180x180.png"

  // Extract coordinates from calendar infos
  // const window_coordinates_list = [{x: 51.505, y: -0.09},{x: 51.506, y: -0.0901},{x: 51.510, y: -0.0904},{x: 51.498, y: -0.0907}]
  const window_coordinates_list = calendarMapInfos.map((window) => {
    return window.address;
  });
  console.log("Outside:", calendarMapInfos);
  console.log("Outside:", window_coordinates_list);

  // calculate center coordinates
  // possible to adjust zoom level such that all Markers can be seen?
  let sumLatitude = 0;
  let sumLongitude = 0;
  for (const coordinates of window_coordinates_list) {
    sumLatitude += coordinates.x;
    sumLongitude += coordinates.y;
  }
  const nr_markers = window_coordinates_list.length;
  const center_coordinates = [sumLatitude / nr_markers, sumLongitude / nr_markers];
  console.log("Center:", center_coordinates);
  
  return (
  <DrawMap center={center_coordinates} coordinatesList={window_coordinates_list} iconPath={icon_path} drawNumbers={true} />
  )
}

export default OverviewMap;