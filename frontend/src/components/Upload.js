import { useState } from 'react';
import { Button, Snackbar } from '@mui/material';

const UploadImage = ({ calendarId, windowNr, onClose, imageUpload, setImageUpload, token }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pictures?calendar_id=${calendarId}&window_nr=${windowNr}`, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token, },
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setImageUpload(!imageUpload);
          setSelectedFile(null);
          setMessage('Image uploaded successfully!');
          setMessageOpen(true);
        } else {
          console.error('Image submission failed:', data.message);
          setMessage('Image upload failed!');
          setMessageOpen(true);
        }
      } catch (error) {
        console.error('Error submitting image:', error);
        setMessage('Image upload failed!');
        setMessageOpen(true);
      }
    }
  };

  // Message display
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessageOpen(false);
  };


  return (
    <div>
      {token ? (
        <>
          <input type="file" onChange={handleFileChange} /><p>Share your memories with us! Upload your photos and images.</p><span className='buttonContainerSlidingWindow'>
            <Button variant="contained" sx={{ backgroundColor: 'green' }} onClick={handleSubmit}>
              Submit Image
            </Button>
          </span>
          <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
        </>
      ) : (
        <>
          <input disabled type="file" onChange={handleFileChange} /><p>Share your memories with us! Upload your photos and images.</p><span className='buttonContainerSlidingWindow'>
            <Button disabled variant="contained" style={{ backgroundColor: 'gray' }}>Login to upload pictures</Button>
          </span>
          <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
        </>
      )}

    </div>
  );
};

export { UploadImage };
