// WindowTile.js
import React, { useCallback, useState, useEffect  } from 'react';
import { Card, CardMedia, CardActionArea, Typography, Paper} from '@mui/material';
import SlidingWindow from './SlidingWindow';

function WindowTile({ window_nr, calendar_id }) {
  // variables to get from SQL request based on window number and calendar id
  const [isFree, setIsFree] = useState(false);
  const [imagePath, setImagePath] = useState('/Window.png');
  const [windowCoordinates, setWindowCoordinates] = useState([{x: 51.505, y: -0.09}]);
  
  // Make an API request to fetch window infos based on window_nr and calendar_id
  const fetchWindowThumbnail = useCallback(async () => {
    try {
      console.log("Calendar id is: " + calendar_id, " Window nr is: " + window_nr);
      const response = await fetch(`http://localhost:7007/api/windowThumbnail?calendar_id=${calendar_id}&window_nr=${window_nr}`);
      const data = await response.json();
      setIsFree(data.isFree);
      if (!(data.imagePath === "")) {
        setImagePath(data.imagePath);
      }
    } catch (error) {
      console.error('Error fetching window:', error);
    }
  }, [calendar_id, window_nr]);

  // Fetch window from the backend when the component mounts
  useEffect(() => {
    fetchWindowThumbnail();
  }, [fetchWindowThumbnail, /* other dependencies if needed */]);

  // State variable to track if SlidingWindow is open or closed
  const [isSlidingWindowOpen, setSlidingWindowOpen] = React.useState(false);

  // Event handler for clicking on the CardMedia
  const handleCardMediaClick = () => {
    // Open or close the SlidingWindow when the CardMedia is clicked
    setSlidingWindowOpen(!isSlidingWindowOpen);
  };

  // other variables
  const is_today = new Date().getDate() === window_nr
  const is_free_visiblity = isFree ? 'visible' : 'hidden';
  const today_border = is_today ? 5 : 0;
  const today_margin = is_today ? '0px' : '5px';
  const cardSize = 150;

  return (<div className="window-tile">
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
          image={imagePath}
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
            Noch frei
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

    {/* Conditional rendering of SlidingWindow (short-circuit) */}
    {isSlidingWindowOpen && (
        <SlidingWindow
          // Pass any necessary props to SlidingWindow component
          window_nr={window_nr}
          calendar_id={calendar_id}
          onClose={() => setSlidingWindowOpen(false)}
        />
      )}
  </div>);


}

export default WindowTile;