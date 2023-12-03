// WindowTile.js
import React from 'react';
import { Card, CardMedia, CardActionArea, Typography, Paper} from '@mui/material';

function WindowTile({ window_nr, calendar_id }) {
  // variables to get from SQL request based on window number and calendar id
  const image_path = "https://www.goenhard.ch/wp-content/uploads/P1130972Adventsfenster_Goenhard_Aarau_2020.jpg" // local path?
  const has_image = false
  const is_free = true

  // other variables
  const is_today = new Date().getDate() === window_nr
  const placeholder_path = "https://clipground.com/images/christmas-door-clipart-1.jpg"
  const available_visibility = is_free ? {} : { visibility: "hidden" }
  const today_border = is_today ? 2: 0
  const cardSize = 150

  return (
    <Card sx={{
      width: cardSize,
      height: cardSize,
      border: today_border,
    }}>
      <CardActionArea sx={{
        width: '100%',
        height: '100%',
      }}>
        <CardMedia
          component="img"
          image={has_image ? image_path : placeholder_path}
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
            justifyContent: 'center'
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={available_visibility}
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
  );
}

export default WindowTile;