// DefaultCalendar.js
import React, { useEffect, useState } from 'react';
import { Grid2, Typography, Box } from '@mui/material';
import OverviewMap from './OverviewMap';
import WindowTile from './WindowTile';

function DefaultCalendar({ id, name, token }) {
  const window_nrs = Array(24).fill().map((_, index) => index + 1);
  const [locationAdded, setLocationAdded] = useState(false); // Trigger re-rendering of map with all locations

  useEffect(() => {},[id]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography className='pageTitle' sx={{paddingBottom: '0'}} variant="h2" align="center">{name}</Typography>
      <OverviewMap key={id} calendar_id={id} locationAdded={locationAdded}/>
      <Grid2 container spacing={2} justifyContent="center">
        {window_nrs.map((window_nr) =>
          <Grid2 item key={window_nr}>
            <WindowTile window_nr={window_nr} calendar_id={id} token={token} locationAdded={locationAdded} setLocationAdded={setLocationAdded}/>
          </Grid2>
        )}
      </Grid2>
    </Box>
  );
}

export default DefaultCalendar;