// InfoSection.js
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import DrawMap from './DrawMap';
import CommentSection from './CommentSection';

const InfoSection = ({
  calendar_id,
  window_nr,
  calendarOwnerId,
  token,
  onClose
}) => {

  const [location_hint, setHint] = useState('');
  const [hasApero, setApero] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [addressName, setAddressName] = useState('');
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/window?calendar_id=${calendar_id}&window_nr=${window_nr}`);
      const { windowData } = await response.json();
      const { address_name, address, apero, time, location_hint } = windowData;
      setHint(location_hint);
      setApero(apero);
      setStartTime(time);
      setAddressName(address_name);
      setCoordinates([address]);
    };

    fetchData();
  }, [calendar_id, token, window_nr]);

  return (
    <>

      <Typography variant="h4">{window_nr}. Advent Window</Typography><Typography variant="body1">Apéro: {hasApero ?
        <span style={{ fontSize: '24px', color: 'black' }}>✓</span> :
        <span style={{ fontSize: '24px', color: 'red' }}>✗</span>}</Typography>
      <Typography variant="body1">{addressName}, starting: {startTime}</Typography>
      {location_hint && <Typography variant="body1">{location_hint}</Typography>}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DrawMap coordinates={coordinates} />
      </div>
      <CommentSection calendar_id={calendar_id} window_nr={window_nr} token={token} calendarOwnerId={calendarOwnerId}/>
      <br />


    </>
  );
};

export default InfoSection;
