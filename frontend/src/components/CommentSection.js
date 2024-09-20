import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from '@mui/material/Snackbar';

function CommentSection({ calendar_id, window_nr, token, calendarOwnerId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [pullComments, setPullComments] = useState(false);
    const [consentChecked, setConsentChecked] = useState(false);
    const [message, setMessage] = useState('');
    const [messageOpen, setMessageOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isCalendarOwner, setIsCalendarOwner] = useState(false);

    useEffect(() => {
        if (token) {
            async function fetchUserId() {
                try {
                    const username = localStorage.getItem('user');
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/userToId?user=${username}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    const data = await response.json();
                    setUserId(data.id);
                    if (data.id === calendarOwnerId) {
                        setIsCalendarOwner(true);
                    }
                } catch (error) {
                    console.error('Error fetching user ID:', error);
                }
            }

            fetchUserId();
        }
    }, [calendarOwnerId, token]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getComments?calendar_id=${calendar_id}&window_nr=${window_nr}`);
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
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/addComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({ comment: newComment, calendar_id, window_nr }),
            });
            setPullComments(!pullComments);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (comment_id) => {
        try {
            const url = `${process.env.REACT_APP_BACKEND_URL}/api/delComment?comment_id=${comment_id}&calendar_id=${calendar_id}&window_nr=${window_nr}`;

            await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            });

            setPullComments(!pullComments);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };


    const handleClose = () => {
        setMessageOpen(false);
    };

    return (
        <>
            {comments.length > 0 && (
                <List sx={{ marginTop: 2, padding: 2, border: '1px solid black', borderRadius: '5px', backgroundColor: '#3e3c36' }}>
                    {comments.map((pers_comment) => (
                        <ListItem key={pers_comment.id} alignItems="flex-start">
                            <ListItemText primary={pers_comment.content} />
                            {console.log(isCalendarOwner)}
                            {(userId === pers_comment.author || isCalendarOwner) && (
                                <IconButton edge="end" onClick={() => handleDeleteComment(pers_comment.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            )}
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
                <TextField disabled label="Comment" variant="outlined" fullWidth />
            )}
            <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
        </>
    );
}

export default CommentSection;
