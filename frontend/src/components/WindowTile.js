// WindowTile.js
import React, { useState, useEffect  } from 'react';
import { Card, CardMedia, CardActionArea, Typography, Paper} from '@mui/material';
import SlidingWindow from './SlidingWindow';
import WindowRegisterWindow from './WindowRegisterWindow';

function WindowTile({ window_nr, calendar_id, token, locationAdded, setLocationAdded }) {
  // variables to get from SQL request based on window number and calendar id
  const [isFree, setIsFree] = useState(false);
  const [imageUpload, setImageUpload] = useState(false);
  const [image, setImage] = useState('/Window.png');

  // State variable to track if SlidingWindow is open or closed
  const [isSlidingWindowOpen, setSlidingWindowOpen] = useState(false);
  const [isWindowRegisterWindowOpen, setWindowRegisterWindowOpen] = useState(false);
  
  useEffect(() => {
    const fetchWindowTileData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/windowTile/${calendar_id}/${window_nr}`);
        const data = await response.json();

        if (data.success) {
          setIsFree(data.isFree);

          if (data.picture.length > 0) {
            const arrayBuffer = Uint8Array.from(data.picture[0].data).buffer;
            const blob = new Blob([arrayBuffer], { type: 'image/png' });
            const reader = new FileReader();
            const base64Image = new Promise((resolve) => {
              reader.onloadend = () => {
                resolve(reader.result);
              };
              reader.readAsDataURL(blob);
            });
            base64Image.then(img => {setImage(img);})
          } else {
            setImage('/Window.png');
          }
        }
      } catch (error) {
        console.error('Error fetching windowTile:', error);
      }
    };

    fetchWindowTileData();
  }, [calendar_id, window_nr, imageUpload, locationAdded]);

  // Event handler for clicking on the CardMedia
  const handleCardMediaClick = () => {
    // Open or close the SlidingWindow when the CardMedia is clicked
    if (isFree) {
      setWindowRegisterWindowOpen(!isWindowRegisterWindowOpen);
    } else {
      setSlidingWindowOpen(!isSlidingWindowOpen);
    }
  };

  // other variables
  const is_today = new Date().getDate() === window_nr
  const is_free_visiblity = isFree ? 'visible' : 'hidden';
  const today_border = is_today ? 5 : 0;
  const today_margin = is_today ? '0px' : '5px';
  const cardSize = 150;

  return (
    <div className="window-tile">
      <Card sx={{
        width: cardSize,
        height: cardSize,
        border: today_border,
        borderColor: 'gold',
        margin: today_margin,
      }}>
        <CardActionArea sx={{
          width: '100%',
          height: '100%',
        }} 
        onClick={handleCardMediaClick}
        >
          <CardMedia
            component="img"
            image={image}
            alt="advent window"
            sx={{ width: '100%', height: '100%', objectFit: 'cover'}}
          />
          <Paper
            variant="outlined"
            sx={{
              position: 'absolute',
              bottom: 5,
              left: 5,
              paddingLeft: 1,
              paddingRight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              visibility: is_free_visiblity
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Still Free
            </Typography>
          </Paper>
          <Paper
            variant="outlined"
            sx={{
              position: 'absolute',
              bottom: 5,
              right: 5,
              width: '32%',
              height: '32%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h4">{window_nr}</Typography>
          </Paper>
        </CardActionArea>
      </Card>  

      {/* Conditional rendering of SlidingWindow or WindowRegisterWindow (short-circuit) */}
      {isSlidingWindowOpen && (
        <SlidingWindow
          // Pass any necessary props to SlidingWindow component
          window_nr={window_nr}
          calendar_id={calendar_id}
          onClose={() => setSlidingWindowOpen(false)}
          imageUpload={imageUpload}
          setImageUpload={setImageUpload}
        />
      )}
      {isWindowRegisterWindowOpen && (
        <WindowRegisterWindow
          // Pass any necessary props to WindowRegisterWindow component
          window_nr={window_nr}
          calendar_id={calendar_id}
          onClose={() => setWindowRegisterWindowOpen(false)}
          token={token}
          locationAdded={locationAdded}
          setLocationAdded={setLocationAdded}
        />
      )}
    </div>
  );


}

export default WindowTile;