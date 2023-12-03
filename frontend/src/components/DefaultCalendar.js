// DefaultCalendar.js
import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import OverviewMap from './OverviewMap';
import WindowTile from './WindowTile';

function DefaultCalendar({ name, details }) {
  // variables to get from SQL request
  const calendar_id = 0 // pass it to windowTiles and send 24 requests or get all info in this component?
  
  // other variables
  const window_nrs = Array(24).fill().map((_, index) => index + 1);

  // TODO: limit number of columns to either 6, 4, 3, 2 or 1

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant="h1" align="center">{name}</Typography>
      <OverviewMap calendar_id={calendar_id} />
      <Grid container spacing={2} justifyContent="center">
        {window_nrs.map((window_nr) =>
          <Grid item>
            <WindowTile window_nr={window_nr} calendar_id={calendar_id} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default DefaultCalendar;