// DefaultCalendar.js
import React, { useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import OverviewMap from './OverviewMap';
import WindowTile from './WindowTile';

function DefaultCalendar({ id, name, token }) {
  const window_nrs = Array(24).fill().map((_, index) => index + 1);
  const [newWindow, setNewWindow] = React.useState(false);
  const [imageUpload, setImageUpload] = React.useState(false);

  useEffect(() => {
    setNewWindow(false);
    setImageUpload(false);
  }, [newWindow, imageUpload]);
  // TODO: limit number of columns to either 6, 4, 3, 2 or 1

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant="h2" align="center">{name}</Typography>
      <OverviewMap key={id} calendar_id={id} reRender={newWindow}/>
      <Grid container spacing={2} justifyContent="center">
        {window_nrs.map((window_nr) =>
          <Grid item key={window_nr}>
            <WindowTile key={id+'_'+window_nr} window_nr={window_nr} calendar_id={id} imageUpload={imageUpload} setImageUpload={setImageUpload} reRender={setNewWindow} token={token}/>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default DefaultCalendar;