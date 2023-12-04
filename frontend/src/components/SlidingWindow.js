import React, { useState } from 'react';
import { Dialog, DialogContent, Typography, Button, TextField, List, ListItem, ListItemText } from '@mui/material';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';



function SlidingWindow({window_nr, calendar_id, onClose, windows_coordinates}) {

    // window number, location hint text, address, apero flag, start_time, end_time fetched from backend
    let location_hint = "Open your eyes";
    let has_apero = true;
    let start_time = "18.00";
    let end_time = "20.00";
    let address = "some address";
    const pers_comments = [["Person1", "Hey, it was great"], ["Person2", "Thanks so much Misses Seidel"], ["Person3", "I liked the Apéro"], ["Person4", "See you next year"]];


    const [newComment, setNewComment] = useState('');

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleAddComment = () => {
        // Need a function to handle the new added comment
        // For example, you might dispatch an action to update state or make an API call
        // handleAddComment(newComment);
    
        // Clear the input field after adding the comment
        setNewComment('');
      };

    // how to get dynamic icon with number inside?
    const icon_path = "https://www.pngall.com/wp-content/uploads/5/Christmas-Star-PNG-Picture-180x180.png"

    return(
        <Dialog open={true} onClose={onClose} sx={{ zIndex: 9999, position: 'absolute' }}>
            <DialogContent sx={{ width: '500px', height: '400px' }}>
            <Typography variant="h4">Calendar ID: {calendar_id}</Typography>
            <Typography variant="h5">Window Number: {window_nr}</Typography>
            <Typography variant="h5">{has_apero ? "Mit Apero" : "Ohne Apero"}</Typography>
    


            <MapContainer center={windows_coordinates[0]} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "80%", margin: 20}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {windows_coordinates.map((window_coordinates, index) => 
                    <Marker position={window_coordinates} icon={new L.icon({ iconUrl: icon_path, iconSize: [32, 32]})}>
                    <Popup>
                        <div>{window_nr}. Dezember<br /></div>
                        <div>Address: {address}</div>
                        <div>Time: {start_time + " - " + end_time}</div>
                        <div>Location hint: {location_hint}</div>
                    </Popup>
                    </Marker>
                )}
            </MapContainer>

            {/* Comment section */}
            <List sx={{ marginTop: 2, padding: 2, border: '1px solid #ccc', borderRadius: 4 }}>
            {pers_comments.map((pers_comment, index) => (
                <ListItem key={index} alignItems="flex-start">
                <span><ListItemText primary={pers_comment[0]} /><ListItemText primary={pers_comment[1]} /></span>
                </ListItem>
            ))}
            </List>

            {/* Form for adding a new comment */}
            <TextField
            label="Add your comment"
            variant="outlined"
            fullWidth
            value={newComment}
            onChange={handleCommentChange}
            />

           <div><Button variant="contained" color="primary" onClick={handleAddComment}>
            Add Comment
            </Button></div>

            { /* add more content here */ }
            <Button variant="contained" color="primary" onClick={onClose}>
              Close
            </Button>
          </DialogContent>
        </Dialog>
      );
}

export default SlidingWindow;