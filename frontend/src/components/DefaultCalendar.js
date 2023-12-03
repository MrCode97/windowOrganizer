// DefaultCalendar.js
import React from 'react';
import { Grid, Typography } from '@mui/material';
import WindowTile from './WindowTile';

function DefaultCalendar({ name, details }) {
  // variables to get from SQL request
  const calendar_id = 0 // pass it to windowTiles and send 24 requests or get all info in this component?

  const window_nrs = Array(24).fill().map((_, index) => index + 1);

  return (
    <div>
      <Typography variant="h2">{name}</Typography>
      <Typography variant="body1">{details}</Typography>
      <Typography variant="body1">Hello from DefaultCalendar.js</Typography>
      <Grid container spacing={2}>
        {window_nrs.map((window_nr) =>
          <Grid item>
            <WindowTile window_nr={window_nr} calendar_id={calendar_id} />
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default DefaultCalendar;