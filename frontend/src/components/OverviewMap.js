// OverviewMap.js
import React, { useCallback, useState, useEffect  } from 'react';
import "leaflet/dist/leaflet.css";
import DrawMap from './DrawMap';

function OverviewMap({ calendar_id }) {
  const [calendarMapInfos, setCalendarMapInfos] = useState([]);
  const [calendarMapCoordinates, setCalendarMapCoordinates] = useState([]);

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
  }, []);

  // Extract coordinates to list from calendar map info
  useEffect(() => {
    setCalendarMapCoordinates(calendarMapInfos.map((window) => {
      return window.address;
    }))
  }, [calendarMapInfos /* other dependencies if needed */]);

  // Other variables
  const icon_path = "https://www.pngall.com/wp-content/uploads/5/Christmas-Star-PNG-Picture-180x180.png"
  
  if (calendarMapCoordinates.length > 0) {
    return (
      <DrawMap coordinatesList={calendarMapCoordinates} iconPath={icon_path} drawNumbers={true} />
    )
  } else {
    return (
      <></>
    )
  }
}

export default OverviewMap;