// DefaultCalendar.js
import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

function DefaultCalendar({ name, details }) {
  const days = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <div>
      <Typography variant="h2">{name}</Typography>
      <Typography variant="body1">{details}</Typography>
      <Typography variant="body1">Hello from DefaultCalendar.js</Typography>
      <Grid container spacing={3} sx={{ p: 2 }}>
        {days.map((day) => (
          <Grid key={day} item xs={4} sm={3} md={2}>
            <Paper 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                color: 'text.secondary', 
                minHeight: '80px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.5rem' 
              }}
            >
              {day}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default DefaultCalendar;