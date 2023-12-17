// DefaultCalendar.js
import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import OverviewMap from './OverviewMap';
import WindowTile from './WindowTile';

function DefaultCalendar({ id, name }) {
  const window_nrs = Array(24).fill().map((_, index) => index + 1);

  // TODO: limit number of columns to either 6, 4, 3, 2 or 1

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant="h2" align="center">{name}</Typography>
      <OverviewMap key={id} calendar_id={id} />
      <Grid container spacing={2} justifyContent="center">
        {window_nrs.map((window_nr) =>
          <Grid item key={window_nr}>
            <WindowTile key={id+'_'+window_nr} window_nr={window_nr} calendar_id={id} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default DefaultCalendar;