// DefaultCalendar.js
import React from 'react';
import { Grid, Typography } from '@mui/material';
import WindowTile from './WindowTile';

function DefaultCalendar({ name, details }) {
  // variables to get from SQL request
  const calendar_id = 0 // pass it to windowTiles and send 24 requests or get all info in this component?
  
  // other variables
  const window_nrs = Array(24).fill().map((_, index) => index + 1);

  return (
    <div>
      <Typography variant="h1" align="center">{name}</Typography>
      <Typography variant="body1">{details}</Typography>
      <Typography variant="body1">Hello from DefaultCalendar.js</Typography>
      <Grid container spacing={2}>
        {window_nrs.map((window_nr) =>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <WindowTile window_nr={window_nr} calendar_id={calendar_id} />
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default DefaultCalendar;