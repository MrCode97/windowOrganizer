// WindowTile.js
import React from 'react';
import { Card, CardContent, CardMedia, CardActionArea, Typography, Paper, Box } from '@mui/material';

function WindowTile({ window_nr, calendar_id }) {
  // variables to get from SQL request based on window number and calendar id
  const image_path = "https://www.goenhard.ch/wp-content/uploads/P1130972Adventsfenster_Goenhard_Aarau_2020.jpg" // local path?
  const has_image = true
  const is_free = true

  // other variables
  const is_today = new Date().getDate() === window_nr
  const placeholder_path = "https://clipground.com/images/christmas-door-clipart-1.jpg"
  const available_visibility = is_free ? {} : { visibility: "hidden" }
  const today_border = is_today ? 2: 0
  const cardSize = 150

  const tileContent = has_image ? (
    <Box sx={{
      width: '100%',
      height: '100%',
    }}>
      <CardMedia
        component="img"
        image={image_path}
        alt="advent window"
        sx={{ width: '100%', height: '100%', objectFit: 'cover'}}
      />
      <Paper variant="outlined" sx={{ position: 'absolute', bottom: 5, right: 5, width: '30%', height: '30%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Typography variant="h4">{window_nr}</Typography>
      </Paper>
    </Box>
  ) : (
    <CardContent>
      <Typography variant="h2" align="center">{window_nr}</Typography>
      <Typography variant="body2" align="center" color="text.secondary" sx={available_visibility}>Noch frei</Typography>
    </CardContent>
  );

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
        {tileContent}
      </CardActionArea>
    </Card>  
  );
}

export default WindowTile;