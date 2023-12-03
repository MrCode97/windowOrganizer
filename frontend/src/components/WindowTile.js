// WindowTile.js
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { CardActionArea } from '@material-ui/core';

function WindowTile({ windowNr }) {
  // variables to get from SQL request
  const image_path = "https://www.goenhard.ch/wp-content/uploads/P1130972Adventsfenster_Goenhard_Aarau_2020.jpg" // local path?
  const has_image = true
  const is_free = true

  // other variables
  const is_today = new Date().getDate() === windowNr
  const available_visibility = is_free ? {} : { visibility: "hidden" }

  const tileContent = has_image ? (
    <div>
      <CardMedia
        component="img"
        height="150"
        image={image_path}
        alt="advent window"
      />
      <Typography variant="h4">{windowNr}</Typography>
    </div>
  ) : (
    <CardContent>
      <Typography variant="h2">{windowNr}</Typography>
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