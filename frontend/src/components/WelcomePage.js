// WelcomePage.js
import React from 'react';
import { Grid, Typography, Box } from '@mui/material';

function WelcomePage() {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant="h1" align="center">Welcome To The AdventCalendar Organizer</Typography>
    </Box>
  );
}

export default WelcomePage;