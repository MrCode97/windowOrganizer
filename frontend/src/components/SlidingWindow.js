import { useState } from 'react';
import { Dialog, DialogContent, Tabs, Tab } from '@mui/material';
import "leaflet/dist/leaflet.css";
import { UploadImage } from './Upload';
import { Gallery } from './Gallery';
import InfoSection from './InfoSection';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import OwnerEditSection from './OwnerEditSection';

function SlidingWindow({ window_nr, calendar_id, onClose, imageUpload, setImageUpload, locationAdded, setLocationAdded, user, token }) {
  const [activeTab, setActiveTab] = useState(0);
  const [ownerUsername, setOwnerUsername] = useState('');
  if (user) {
    try {
      const fetchData = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/windowTile/owner?calendar_id=${calendar_id}&window_nr=${window_nr}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const result = await response.json();

        if (Object.keys(result).length !== 0) {
          setOwnerUsername(result.username);
        }
      };

      fetchData();
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      sx={{
        zIndex: 9999,
        position: 'fixed',
        maxWidth: 'none',
        maxHeight: 'none',
        margin: 0,
        borderRadius: '10px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#7A1B1B', color: '#FFF4E0' }}>
        <Tabs value={activeTab} onChange={handleChangeTab} sx={{ backgroundColor: '#7A1B1B', color: '#FFF4E0' }}>
          <Tab label="Window information" />
          <Tab label="Gallery" />
          <Tab label="Image Upload" />
          {user === ownerUsername && <Tab label="Edit" />}
        </Tabs>
        <div>
          {/* Close Button */}
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: '#FFF4E0' }} />          </IconButton>
        </div>
      </div>

      <DialogContent sx={{ backgroundColor: '#FFF4E0', padding: '20px', borderRadius: '10px' }}>
        {/* Tab Content */}
        {user && user !== ownerUsername && (
          <h3>Host: {ownerUsername}</h3>
        )}

        {user && user === ownerUsername && (
          <h3>Owner: {ownerUsername}</h3>
        )}

        {/* Existing Tabs */}
        {activeTab === 0 && (
          <InfoSection
            window_nr={window_nr}
            onClose={onClose}
            calendar_id={calendar_id}
            token={token}
          />
        )}

        {activeTab === 1 && (
          <Gallery
            calendarId={calendar_id}
            windowNr={window_nr}
            onClose={onClose}
          />
        )}

        {activeTab === 2 && (
          <UploadImage
            calendarId={calendar_id}
            windowNr={window_nr}
            onClose={onClose}
            imageUpload={imageUpload}
            setImageUpload={setImageUpload}
            token={token}
          />
        )}

        {user === ownerUsername && activeTab === 3 && (
          <OwnerEditSection
            calendar_id={calendar_id}
            window_nr={window_nr}
            token={token}
            locationAdded={locationAdded}
            setLocationAdded={setLocationAdded}
          />
        )}
      </DialogContent>
    </Dialog>

  );
}

export default SlidingWindow;