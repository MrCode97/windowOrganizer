import { useState } from 'react';
import { Button, Snackbar, Checkbox, FormControlLabel } from '@mui/material';

const UploadImage = ({ calendarId, windowNr, onClose, imageUpload, setImageUpload, token }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!consentChecked) {
      setMessage('You must agree to the terms before uploading an image.');
      setMessageOpen(true);
      return;
    }

    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pictures?calendar_id=${calendarId}&window_nr=${windowNr}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, },
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setImageUpload(!imageUpload);
          setSelectedFile(null);
          setMessage('Image uploaded successfully!');
          setMessageOpen(true);
        } else {
          setMessage('Image upload failed!');
          setMessageOpen(true);
        }
      } catch (error) {
        setMessage('Image upload failed!');
        setMessageOpen(true);
      }
    }
  };

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
          <input type="file" onChange={handleFileChange} />
          <p>Share your memories with us! Upload your photos and images.</p>
          <FormControlLabel
            control={<Checkbox checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} />}
            label="I agree that no problematic content will be tolerated, and I have the rights to the image."
            sx={{ marginBottom: '10px' }}
          />
          <Button variant="contained" sx={{ backgroundColor: 'green' }} onClick={handleSubmit}>
            Submit Image
          </Button>
          <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
        </>
      ) : (
        <>
          <input disabled type="file" onChange={handleFileChange} />
          <p>Share your memories with us! Upload your photos and images.</p>
          <Button disabled variant="contained" style={{ backgroundColor: 'gray' }}>
            Login to upload pictures
          </Button>
          <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
        </>
      )}
    </div>
  );
};

export { UploadImage };
