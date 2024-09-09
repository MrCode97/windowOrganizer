import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// CommentSection.js
function CommentSection({ calendar_id, window_nr, token }) {

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [pullComments, setPullComments] = useState(false);

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

    return (
        <>
            {/* Display comments */}
            {comments.length > 0 && (
                <List sx={{ marginTop: 2, padding: 2, border: '1px solid black', borderRadius: '5px', backgroundColor: '#3e3c36' }}>
                    {comments.map((pers_comment, index) => (
                        <ListItem key={index} alignItems="flex-start">
                            <ListItemText primary={pers_comment} />
                        </ListItem>
                    ))}
                </List>
            )}

            {/* Adding comments */}
            {token ? (
                <from onSubmit={handleNewComment}>
                    <TextField
                        sx={{ marginTop: '5px', border: '1px solid black', backgroundColor: '#3e3c36', borderRadius: '5px' }}
                        label="Comment"
                        variant="outlined"
                        fullWidth value={newComment}
                        onChange={(e) => setNewComment(e.target.value)} />
                    <div style={{ marginTop: '10px' }}></div>
                    <Button type="submit" variant="contained" style={{ backgroundColor: 'green' }} onClick={handleNewComment}>
                        Add Comment
                    </Button>

                </from>
            ) : (
                <>
                    <TextField disabled
                        sx={{ marginTop: '5px', border: '1px solid black', backgroundColor: '#3e3c36', borderRadius: '5px' }}
                        label="Comment"
                        variant="outlined"
                        fullWidth value={newComment}
                        onChange={(e) => setNewComment(e.target.value)} />
                    <div style={{ marginTop: '10px' }}></div>
                    <Button disabled variant="contained" style={{ backgroundColor: 'gray' }}>Login to add comments</Button></>)}
        </>
    );
};

export default CommentSection;