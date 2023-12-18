import React, { useState, useEffect } from 'react';
import { Button, Snackbar} from '@mui/material';

const UploadImage = ({ calendarId, windowNr, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);

  // API request
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);

      try {
        const response = await fetch(`http://localhost:7007/api/upload-image/${calendarId}/${windowNr}`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          console.log('Image submitted successfully');
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
      <input type="file" onChange={handleFileChange} />
      <p>Share your memories with us! Upload your photos and images.</p>
      <span className='buttonContainerSlidingWindow'>
        <Button variant="contained" sx={{backgroundColor: 'green'}} onClick={handleSubmit}>
          Submit Image
        </Button>
        <Button variant="contained" sx={{backgroundColor: 'green'}} onClick={onClose}>
          Close
        </Button>
      </span>
      <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
    </div>
  );
};

export { UploadImage };
