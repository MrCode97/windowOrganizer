// WelcomePage.js
import { Typography, Box } from '@mui/material';

function WelcomePage() {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography className='pageTitle' variant="h2" align="center">Welcome To The AdventCalendar Organizer</Typography>
      <Typography className='welcomeParagraph' align='center'>
        Whether you’re an artist at heart wishing to adorn your window, or a cheerful wanderer
        eager to explore the glowing tapestry of your community, our website is your gateway
        to this festive experience. As a local organizer, you can create a calendar for your
        village or district, and residents can volunteer to decorate their windows on specific
        days, turning their homes into a part of a larger, communal celebration.
      </Typography>
      <Typography className='welcomeParagraph' align='center'>
        Visitors can use our platform to find decorated windows, plan their holiday strolls
        with our interactive map, and afterwards, share their experiences and photos. It's a
        wonderful way to connect, celebrate, and spread joy during the holiday season.
      </Typography>
      <Typography className='welcomeParagraph' align='center'>
        If you only want to visit decorated windows, simply search for the calendar of your
        community in the sidebar and click on the window of the current day. If your community
        has no calendar yet or you want to organize a window yourself, please register first as
        a user and then either create a new calendar by choosing the option in the sidebar or
        click on a window, which is still marked as "free".
      </Typography>
      <Typography className='welcomeParagraph' align='center'>
        Join us in lighting up neighborhoods with warmth, creativity, and community spirit.
        Let the holiday cheer begin!
      </Typography>
    </Box>
  );
}

export default WelcomePage;