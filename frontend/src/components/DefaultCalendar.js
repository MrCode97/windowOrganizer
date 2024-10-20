import { useState } from 'react';
import { Grid2, Typography, Box, Button, TextField, Tooltip } from '@mui/material';
import OverviewMap from './OverviewMap';
import WindowTile from './WindowTile';
import { useDefaultCalendarStrings } from '../contexts/text';

function DefaultCalendar({ id, name, additionalInfo, calendarOwner, locked, user, token }) {
  const window_nrs = Array(24).fill().map((_, index) => index + 1);
  const [locationAdded, setLocationAdded] = useState(false); // Trigger re-rendering of map with all locations
  const [showShareLink, setShowShareLink] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const {
    share,
    copy,
    hintCopy,
    hintCopyError,
    hintLocked,
  } = useDefaultCalendarStrings();

  const handleCopyToClipboard = () => {
    const shareableLink = `${window.location.origin}/?calendarName=${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(shareableLink)
      .then(() => setCopySuccess(hintCopy))
      .catch(() => setCopySuccess(hintCopyError));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography
        className='pageTitle'
        sx={{
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '10px',
          fontWeight: 'bold',
        }}
        variant="h2"
        align="center"
      >
        {name}
      </Typography>
      {locked && (
        <Typography
          sx={{
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '10px',
            fontWeight: 'bold',
          }}
          variant="body1"
          align="center"
        >
          {hintLocked}
        </Typography>
      )}
      
      {additionalInfo && (
        <Typography
          sx={{
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '10px',
            fontWeight: 'bold',
          }}
          variant="body1"
          align="center"
        >
          {additionalInfo}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowShareLink(!showShareLink)}
        sx={{ marginBottom: '20px' }}
      >
        {share}
      </Button>

      {showShareLink && (
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <TextField
            value={`${window.location.origin}/?calendarName=${encodeURIComponent(name)}`}
            variant="outlined"
            size="small"
            InputProps={{
              readOnly: true,
            }}
            sx={{ width: '300px', marginRight: '10px' }}
          />
          <Tooltip title="Copy to Clipboard">
            <Button onClick={handleCopyToClipboard} variant="contained">
              {copy}
            </Button>
          </Tooltip>
        </Box>
      )}
      {copySuccess && <Typography color="success.main">{copySuccess}</Typography>}

      <OverviewMap
        key={id}
        calendar_id={id}
        locationAdded={locationAdded}
        sx={{
          border: '2px solid #D4AF37',
          borderRadius: '10px',
          marginBottom: '20px',
        }}
      />
      <Grid2 container spacing={2} justifyContent="center">
        {window_nrs.map((window_nr) =>
          <Grid2 item key={window_nr}>
            <WindowTile window_nr={window_nr} calendar_id={id} user={user} calendarOwner={calendarOwner} token={token} locationAdded={locationAdded} setLocationAdded={setLocationAdded} />
          </Grid2>
        )}
      </Grid2>
    </Box>
  );
}

export default DefaultCalendar;
