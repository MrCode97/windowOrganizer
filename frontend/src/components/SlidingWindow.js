import React, { useCallback, useState, useEffect  } from 'react';
import { Dialog, DialogContent, Tabs, Tab } from '@mui/material';
import "leaflet/dist/leaflet.css";
import Gallery from './Gallery'
import CommentSection from './InfoSection';
// Todo: - address from Backend in a senseful way
// - test if adding comments works already
// - fetch time from backend aswell
// fetch address from backend
// implement image load/ upload


function SlidingWindow({window_nr, calendar_id, onClose}) {

    // window number, location hint text, address, apero flag, start_time, end_time fetched from backend
    //let start_time = "18.00";
    //let end_time = "20.00"; // can we drop this?
    //let address = "Stockerstrasse 23, 8050 Zürich";
    //let windows_coordinates = [{x: 51.505, y: -0.09}];

    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [location_hint, setHint] = useState("");
    const [hasApero, setApero] = useState(false);
    const [startTime, setStartTime] = useState("18.00");
    const [endTime, setEndTime] = useState("20.00");
    const [addressName, setAddressName] = useState("Stockerstrasse 23, 8050 Zürich");
    const [coordinates, setCoordinates] = useState([]);

    const fetchData = async () => {
      const response = await fetch(`http://localhost:7007/api/getWindowData?calendar_id=${calendar_id}&window_nr=${window_nr}`);
      const { windowData } = await response.json();
      const {owner, address_name, address, apero, time, image_paths, pictures, comments} = windowData;
      setComments(comments);
      setHint(location_hint);
      setApero(apero);
      setStartTime(time);
      setAddressName(address_name);
      setCoordinates([address]);
    };

    useEffect(() => {
        fetchData();
      }, []);

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
            <Tab label="Image gallery" />
            </Tabs>
            <DialogContent sx={{ width: '400px', height: '700px' }}>

            {activeTab === 0 && <CommentSection window_nr={window_nr}
            windows_coordinates={coordinates}
            onClose={onClose}
            calendar_id={calendar_id}
            />}
            {activeTab === 1 && <Gallery onClose={onClose}/>}
            </DialogContent>
        </Dialog>
      );
}

export default SlidingWindow;