import React from 'react';
import { Dialog, DialogContent, Tabs, Tab } from '@mui/material';
import "leaflet/dist/leaflet.css";
import { UploadImage } from './Upload';
import { Gallery } from './Gallery';
import InfoSection from './InfoSection';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function SlidingWindow({ window_nr, calendar_id, onClose, imageUpload, setImageUpload }) {
  const [activeTab, setActiveTab] = React.useState(0);

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
      }}
    >
      {/* Header with Icons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: 'rgb(173, 216, 230)' }}>
        <Tabs value={activeTab} onChange={handleChangeTab} sx={{ backgroundColor: 'rgb(173, 216, 230)' }}>
          <Tab label="Window information" />
          <Tab label="Gallery" />
          <Tab label="Image Upload" />
        </Tabs>
        <div>
          {/* Close Button */}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>

      <DialogContent sx={{backgroundColor: 'rgb(173, 216, 230)',}}
      >
        {/* Tab Content */}
        {activeTab === 0 && (
          <InfoSection window_nr={window_nr} onClose={onClose} calendar_id={calendar_id} />
        )}
        {activeTab === 1 && (
          <Gallery calendarId={calendar_id} windowNr={window_nr} onClose={onClose} />
        )}
        {activeTab === 2 && (
          <UploadImage
            calendarId={calendar_id}
            windowNr={window_nr}
            onClose={onClose}
            imageUpload={imageUpload}
            setImageUpload={setImageUpload}
          />
        )}
      </DialogContent>
    </Dialog>

  );
}

export default SlidingWindow;