// WelcomePage.js
import { Typography, Box } from '@mui/material';
import { useWelcomePageStrings } from '../contexts/text';

function WelcomePage() {
  const { title, p1, p2, p3, p4 } = useWelcomePageStrings();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography className='pageTitle' variant="h2" align="center">{title}</Typography>
      <Typography className='welcomeParagraph' align='center'>
        {p1}
      </Typography>
      <Typography className='welcomeParagraph' align='center'>
        {p2}
      </Typography>
      <Typography className='welcomeParagraph' align='center'>
        {p3}
      </Typography>
      <Typography className='welcomeParagraph' align='center'>
        {p4}
      </Typography>
    </Box>
  );
}

export default WelcomePage;