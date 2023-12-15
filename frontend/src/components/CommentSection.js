// CommentSection.js
import React, { useCallback, useState, useEffect  } from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DrawMap from './DrawMap'; // Make sure to replace with the correct path

const CommentSection = ({
  calendar_id,
  window_nr,
  windows_coordinates,
  onClose
}) => {
    let start_time = "18.00";
    let end_time = "20.00";
    let address = "Stockerstrasse 23, 8050 Zürich";

    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [location_hint, setHint] = useState("");
    const [hasApero, setApero] = useState(false);


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
          console.log("Calendar id is: " + calendar_id, " Window nr is: " + window_nr);
          const response = await fetch(`http://localhost:7007/api/calendar/comments?calendar_id=${calendar_id}&window_nr=${window_nr}`);
          const data = await response.json();
          setComments(data.comments);
          console.log("here we are");
          setHint(data.location_hint);
          console.log("Location hint is: " + location_hint);
          setApero(data.hasApero);

        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }, [window_nr, calendar_id, setComments, setApero, location_hint]);

    useEffect(() => {
        // Fetch comments from the backend when the component mounts
        fetchCommentsFromBackend();
      }, [fetchCommentsFromBackend]);
      

    const handleAddComment = async () => {
        try {
        // Make an API request to add a comment
        await fetch(`http://localhost:7007/api/calendars/addComment?calendar_id=${calendar_id}&window_nr=${window_nr}`, {
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

    // how to get dynamic icon with number inside?
    const icon_path = "https://www.pngall.com/wp-content/uploads/5/Christmas-Star-PNG-Picture-180x180.png"




  return (
    <>
      <Typography variant="h4">Window #{window_nr}</Typography>
      <Typography variant="body1">{address}</Typography>
      <Typography variant="body1" style={{ color: 'blue' }}>
        {start_time + ' - ' + end_time}
      </Typography>

      <DrawMap center={windows_coordinates[0]} coordinatesList={windows_coordinates} iconPath={icon_path} drawNumbers={false} />

      <Typography variant="body1">Apéro: {hasApero ? 'Ja' : 'Nein'}</Typography>
      <Typography variant="body1">Location Hint: {location_hint}</Typography>

      {/* Comment section */}
      {comments !== undefined && comments.length !== 0 && (
        <List sx={{ marginTop: 2, padding: 2, border: '1px solid #ccc', borderRadius: 4 }}>
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
      <TextField label="Add your comment" variant="outlined" fullWidth value={newComment} onChange={handleCommentChange} />

      <span><Button variant="contained" color="primary" onClick={handleAddComment}>
        Add Comment
      </Button>
      <Button variant="contained" color="primary" onClick={onClose}>
                Close
      </Button>
      </span>
      <br />
    </>
  );
};

export default CommentSection;