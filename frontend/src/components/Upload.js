import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

const UploadImage = ({ calendarId, windowNr, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);

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
        } else {
          console.error('Image submission failed:', data.message);
        }
      } catch (error) {
        console.error('Error submitting image:', error);
      }
    }
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
    </div>
  );
};

export { UploadImage };
