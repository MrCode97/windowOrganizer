import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// CommentSection.js
function CommentSection({ calendar_id, window_nr}) {
    
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [pullComments, setPullComments] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/calendar/comments?calendar_id=${calendar_id}&window_nr=${window_nr}`);
            const data = await response.json();
            setComments(data.comments);
        };
        fetchData();
    }, [calendar_id, pullComments, window_nr]);
    
    const handleNewComment = async (event) => {
        event.preventDefault();

        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/calendars/addComment?calendar_id=${calendar_id}&window_nr=${window_nr}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment: newComment }),
            });
            setPullComments(!pullComments);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };
    
    return(
        <>
        {/* Display comments */}
        {comments.length > 0 && (
            <List sx={{ marginTop: 2, padding: 2, border: '1px solid black', borderRadius: '5px', backgroundColor: 'white' }}>
            {comments.map((pers_comment, index) => (
                <ListItem key={index} alignItems="flex-start">
                    <ListItemText primary={pers_comment} />
                </ListItem>
            ))}
            </List>
        )}

        {/* Adding comments */}
        <from onSubmit={handleNewComment}>
            <TextField 
                sx={{ marginTop: '5px', border: '1px solid black', backgroundColor: 'white', borderRadius: '5px'}} 
                label="Comment" 
                variant="outlined" 
                fullWidth value={newComment} 
                onChange={(e) => setNewComment(e.target.value)}/>
            <div style={{ marginTop: '10px' }}></div>
            <Button type="submit" variant="contained" style={{backgroundColor: 'green'}} onClick={handleNewComment}>
                Add Comment
            </Button>
        </from>
        </>
    );
};

export default CommentSection;