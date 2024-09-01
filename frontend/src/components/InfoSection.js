// InfoSection.js
import React, { useCallback, useState, useEffect  } from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DrawMap from './DrawMap'; // Make sure to replace with the correct path

const InfoSection = ({
  calendar_id,
  window_nr,
  onClose
}) => {
  
  const [location_hint, setHint] = useState("undefined");
  const [hasApero, setApero] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [startTime, setStartTime] = useState("18.00");
  const [addressName, setAddressName] = useState("Stockerstrasse 23, 8050 Zürich");
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:7007/api/getWindowData?calendar_id=${calendar_id}&window_nr=${window_nr}`);
      const { windowData } = await response.json();
      const { address_name, address, apero, time, location_hint, comments } = windowData;
      setComments(comments);
      setHint(location_hint);
      setApero(apero);
      setStartTime(time);
      setAddressName(address_name);
      setCoordinates([address]);
    };

    fetchData();
  }, [calendar_id, window_nr]);



    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const fetchCommentsFromBackend = useCallback(async () => {
        
        // Need to ensure that calendar_ids and window_nrs are actually in our DB 
        // to do so we need to create for every new calendar 24 advent Windows
        // for now we use static variables instead of calendar_id and window_nr
        // pabeer: we could also check whether an SQL returns empty in the backend and link to a window registration page in that case 


        try {
          // Make an API request to fetch comments based on window_nr and calendar_id
          const response = await fetch(`http://localhost:7007/api/calendar/comments?calendar_id=${calendar_id}&window_nr=${window_nr}`);
          const data = await response.json();
          setComments(data.comments);
          setHint(data.location_hint);
          setApero(data.hasApero);

        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }, [window_nr, calendar_id, setComments, setApero]);

    useEffect(() => {
        // Fetch comments from the backend when the component mounts
        fetchCommentsFromBackend();
      }, [fetchCommentsFromBackend]);
      

    const handleAddComment = async () => {
        try {
        // Make an API request to add a comment
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/calendars/addComment?calendar_id=${calendar_id}&window_nr=${window_nr}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment: newComment }),
        });

        // Refetch comments from the backend to update the UI with the new comment
        fetchCommentsFromBackend();

        // Clear the input field after adding the comment
        setNewComment('');
        } catch (error) {
        console.error('Error adding comment:', error);
        }
    };

  return (
    <>
      <Typography variant="h4">Window #{window_nr}</Typography>
      <Typography variant="body1">{addressName}</Typography>
      <Typography variant="body1">
        {startTime}
      </Typography>

      <DrawMap coordinates={coordinates} sx={{borderTopLeftRadius: '4px'}} />

      <Typography variant="body1">Apéro: {hasApero ? 'Ja' : 'Nein'}</Typography>
      <Typography variant="body1">Location Hint: {location_hint}</Typography>

      {/* Comment section */}
      {comments !== undefined && comments.length !== 0 && (
        <List sx={{ marginTop: 2, padding: 2, border: '1px solid black', borderRadius: '5px', backgroundColor: 'white' }}>
          {comments.map((pers_comment, index) => (
            <ListItem key={index} alignItems="flex-start">
              <span>
                <ListItemText primary={pers_comment} />
              </span>
            </ListItem>
          ))}
        </List>
      )}

      {/* Form for adding a new comment */}
      <TextField sx={{ marginTop: '5px', border: '1px solid black', backgroundColor: 'white', borderRadius: '5px'}} label="Add your comment" variant="outlined" fullWidth value={newComment} onChange={handleCommentChange} />

      <span className='buttonContainerSlidingWindow'>
        <Button variant="contained" style={{backgroundColor: 'green'}} onClick={handleAddComment}>
          Add Comment
        </Button>
        <Button variant="contained" style={{backgroundColor: 'green'}} onClick={onClose}>
          Close
        </Button>
      </span>
      <br />
    </>
  );
};

export default InfoSection;
