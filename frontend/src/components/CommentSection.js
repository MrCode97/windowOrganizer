import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from '@mui/material/Snackbar';

function CommentSection({ calendar_id, window_nr, token }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [pullComments, setPullComments] = useState(false);
    const [consentChecked, setConsentChecked] = useState(false);
    const [message, setMessage] = useState('');
    const [messageOpen, setMessageOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/comments?calendar_id=${calendar_id}&window_nr=${window_nr}`);
            const data = await response.json();
            setComments(data.comments);
        };
        fetchData();
    }, [calendar_id, pullComments, window_nr]);

    const handleNewComment = async (event) => {
        event.preventDefault();

        if (!consentChecked) {
            setMessage('You must agree to the terms before adding a comment.');
            setMessageOpen(true);
            return;
        }

        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/comments?calendar_id=${calendar_id}&window_nr=${window_nr}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({ comment: newComment }),
            });
            setPullComments(!pullComments);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleClose = () => {
        setMessageOpen(false);
    };

    return (
        <>
            {comments.length > 0 && (
                <List sx={{ marginTop: 2, padding: 2, border: '1px solid black', borderRadius: '5px', backgroundColor: '#3e3c36' }}>
                    {comments.map((pers_comment, index) => (
                        <ListItem key={index} alignItems="flex-start">
                            <ListItemText primary={pers_comment} />
                        </ListItem>
                    ))}
                </List>
            )}

            {token ? (
                <form onSubmit={handleNewComment}>
                    <TextField
                        sx={{ marginTop: '5px', border: '1px solid black', backgroundColor: '#3e3c36', borderRadius: '5px' }}
                        label="Comment"
                        variant="outlined"
                        fullWidth
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} />}
                        label="I agree that no problematic content will be tolerated, and my comment is respectful."
                        sx={{ marginTop: '10px' }}
                    />
                    <Button type="submit" variant="contained" style={{ backgroundColor: 'green' }} sx={{ marginTop: '10px' }}>
                        Add Comment
                    </Button>
                </form>
            ) : (
                <>
                    <TextField disabled
                        sx={{ marginTop: '5px', border: '1px solid black', backgroundColor: '#3e3c36', borderRadius: '5px' }}
                        label="Comment"
                        variant="outlined"
                        fullWidth
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)} />
                    <Button disabled variant="contained" style={{ backgroundColor: 'gray' }} sx={{ marginTop: '10px' }}>
                        Login to add comments
                    </Button>
                </>
            )}
            <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
        </>
    );
};

export default CommentSection;
