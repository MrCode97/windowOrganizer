import React, { useCallback, useState, useEffect  } from 'react';
import { Dialog, DialogContent, Tabs, Tab } from '@mui/material';
import "leaflet/dist/leaflet.css";
import { UploadImage } from './Upload'; 
import { Gallery } from './Gallery';
import CommentSection from './InfoSection';
// Todo: - address from Backend in a senseful way
// - test if adding comments works already
// - fetch time from backend aswell
// fetch address from backend
// implement image load/ upload


function SlidingWindow({window_nr, calendar_id, onClose}) {

    // how to get dynamic icon with number inside?
    const icon_path = "https://www.pngall.com/wp-content/uploads/5/Christmas-Star-PNG-Picture-180x180.png"

    const [activeTab, setActiveTab] = React.useState(0);

    const handleChangeTab = (event, newValue) => {
        setActiveTab(newValue);
    };

    return(
        <Dialog open={true} onClose={onClose} sx={{ zIndex: 9999, position: 'absolute' }}>
            <Tabs value={activeTab} onChange={handleChangeTab}>
            <Tab label="Window information" />
            <Tab label="Gallery" />
            <Tab label="Image Upload" />
            </Tabs>
            <DialogContent sx={{ width: '400px', height: '700px' }}>

            {activeTab === 0 && <CommentSection 
              window_nr={window_nr}
              onClose={onClose}
              calendar_id={calendar_id}
            />}
            {activeTab === 1 && <Gallery 
              calendarId={calendar_id}
              windowNr={window_nr}
              onClose={onClose}
            />}
            {activeTab === 2 && <UploadImage 
              calendarId={calendar_id}
              windowNr={window_nr}
              onClose={onClose}
            />}
            </DialogContent>
        </Dialog>
      );
}

export default SlidingWindow;