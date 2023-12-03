// CalendarPage.js
import React from 'react';
import Grid from '@material-ui/core/Grid';
import WindowTile from './WindowTile';

function CalendarPage() {
  // variables to get from SQL request
  const calendar_id = 0 // pass it to windowTiles and send 24 requests or get all info in this component?

  const windowNrs = Array(24).fill().map((_, index) => index + 1);
  return (
    <div>
      This is the calendar page.
      <Grid container spacing={2}>
        {windowNrs.map((windowNr) =>
          <Grid item>
            <WindowTile windowNr={windowNr} className="windowTile" />
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default CalendarPage;