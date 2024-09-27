import { useState, useEffect } from 'react';
import { Card, CardMedia, CardActionArea, Typography, Paper } from '@mui/material';
import SlidingWindow from './SlidingWindow';
import WindowRegisterWindow from './WindowRegisterWindow';

function WindowTile({ window_nr, calendar_id, user, calendarOwner, token, locationAdded, setLocationAdded }) {
  // variables to get from SQL request based on window number and calendar id
  const [isFree, setIsFree] = useState(false);
  const [imageUpload, setImageUpload] = useState(false);
  const [image, setImage] = useState('/Window.png');

  // State variable to track if SlidingWindow is open or closed
  const [isSlidingWindowOpen, setSlidingWindowOpen] = useState(false);
  const [isWindowRegisterWindowOpen, setWindowRegisterWindowOpen] = useState(false);

  useEffect(() => {
    const fetchWindowTileData = async () => {
      const getDynamicImagePath = (isFree) => {
        const basePath = isFree ? '/emptyWindow/art' : '/happyWindow';
        const fileName = `${window_nr}.png`; // Generate file name dynamically based on window number
        return `${basePath}/${fileName}`;
      };

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/windowTile?calendar_id=${calendar_id}&window_nr=${window_nr}`);
        const data = await response.json();

        if (data.success) {
          setIsFree(data.isFree);

          // Check if picture is null or empty
          if (data.picture && data.picture.data.length > 0) {
            const arrayBuffer = Uint8Array.from(data.picture.data).buffer;
            const blob = new Blob([arrayBuffer], { type: data.picture.type });
            const reader = new FileReader();
            const base64Image = new Promise((resolve) => {
              reader.onloadend = () => {
                resolve(reader.result);
              };
              reader.readAsDataURL(blob);
            });

            base64Image.then((img) => {
              setImage(img);
              setImageUpload(true);
            });
          } else {
            // No picture available, reset the image and use dynamic path
            setImage(getDynamicImagePath(data.isFree)); // Use the default dynamic image path
            setImageUpload(false); // Reset image upload flag
          }
        }
      } catch (error) {
        console.error('Error fetching windowTile:', error);
      }
    };

    fetchWindowTileData();
  }, [calendar_id, window_nr, locationAdded, imageUpload, isFree]);


  const handleCardMediaClick = () => {
    // Open or close the SlidingWindow when the CardMedia is clicked
    if (isFree) {
      setWindowRegisterWindowOpen(true);
      setSlidingWindowOpen(false);
    } else {
      setSlidingWindowOpen(true);
      setWindowRegisterWindowOpen(false);
    }
  };

  // other variables
  const is_today = new Date().getDate() === window_nr;
  const is_free_visiblity = isFree ? 'visible' : 'hidden';
  const today_border = is_today ? 5 : 0;
  const today_margin = is_today ? '0px' : '5px';
  const cardSize = 150;

  const greyedOutEffect = !isFree && !imageUpload ? 'grayscale(100%)' : 'none';

  return (
    <div className="window-tile">
      <Card sx={{
        width: cardSize,
        height: cardSize,
        border: today_border,
        borderColor: 'gold',
        margin: today_margin,
        filter: greyedOutEffect,
        transition: 'all 0.3s ease',
        boxShadow: isFree ? '0px 0px 10px rgba(255, 215, 0, 0.8)' : 'none',
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
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
              backgroundColor: 'rgba(0, 128, 0, 0.8)',
              color: 'white',
              borderRadius: '4px',
              visibility: is_free_visiblity,
            }}
          >
            <Typography
              variant="body2"
              color="inherit"
            >
              Available!
            </Typography>
          </Paper>
          <Paper
            variant="outlined"
            sx={{
              position: 'absolute',
              bottom: 5,
              right: 5,
              width: '24%',
              height: '24%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#504d52',
              color: 'white',
              borderRadius: '4px',
              padding: 0,
            }}
          >
            <Typography variant="h5" sx={{ lineHeight: 1 }}>{window_nr}</Typography>
          </Paper>
        </CardActionArea>
      </Card>

      {isSlidingWindowOpen && (
        <SlidingWindow
          window_nr={window_nr}
          calendar_id={calendar_id}
          onClose={() => setSlidingWindowOpen(false)}
          setIsFree={setIsFree}
          imageUpload={imageUpload}
          setImageUpload={setImageUpload}
          locationAdded={locationAdded}
          setLocationAdded={setLocationAdded}
          calendarOwner={calendarOwner}
          user={user}
          token={token}
        />
      )}
      {isWindowRegisterWindowOpen && (
        <WindowRegisterWindow
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
