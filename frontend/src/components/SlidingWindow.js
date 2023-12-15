import React from 'react';
import { Dialog, DialogContent, Tabs, Tab } from '@mui/material';
import "leaflet/dist/leaflet.css";
import Gallery from './Gallery'
import CommentSection from './CommentSection';
// Todo: - address from Backend in a senseful way
// - test if adding comments works already
// - fetch time from backend aswell
// fetch address from backend
// implement image load/ upload


function SlidingWindow({window_nr, calendar_id, onClose, windows_coordinates}) {


    const [activeTab, setActiveTab] = React.useState(0);

    const handleChangeTab = (event, newValue) => {
        setActiveTab(newValue);
    };

    return(
        <Dialog open={true} onClose={onClose} sx={{ zIndex: 9999, position: 'absolute' }}>
            <Tabs value={activeTab} onChange={handleChangeTab}>
            <Tab label="Window information" />
            <Tab label="Image gallery" />
            </Tabs>
            <DialogContent sx={{ width: '400px', height: '700px' }}>

            {activeTab === 0 && <CommentSection window_nr={window_nr}
            windows_coordinates={windows_coordinates}
            onClose={onClose}
            calendar_id={calendar_id}
            />}
            {activeTab === 1 && <Gallery onClose={onClose}/>}
            </DialogContent>
        </Dialog>
      );
}

export default SlidingWindow;