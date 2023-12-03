// WindowTile.js
import React from 'react';
import { Card, CardContent, CardMedia, CardActionArea, Typography } from '@mui/material';

function WindowTile({ window_nr, calendar_id }) {
  // variables to get from SQL request based on window number and calendar id
  const image_path = "https://www.goenhard.ch/wp-content/uploads/P1130972Adventsfenster_Goenhard_Aarau_2020.jpg" // local path?
  const has_image = false
  const is_free = true

  // other variables
  const is_today = new Date().getDate() === window_nr
  const available_visibility = is_free ? {} : { visibility: "hidden" }

  const tileContent = has_image ? (
    <div>
      <CardMedia
        component="img"
        height="150"
        image={image_path}
        alt="advent window"
      />
      <Typography variant="h4">{window_nr}</Typography>
    </div>
  ) : (
    <CardContent>
      <Typography variant="h2">{window_nr}</Typography>
      <Typography variant="body2" color="text.secondary" style={available_visibility}>Noch frei</Typography>
    </CardContent>
  );

  return (
    <Card>
      <CardActionArea>
        {tileContent}
      </CardActionArea>
    </Card>  
  );
}

export default WindowTile;