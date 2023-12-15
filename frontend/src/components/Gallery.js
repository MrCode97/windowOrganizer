import React, { useState } from 'react';
import Button from '@mui/material/Button';

const Gallery = ({ onImageSubmit, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    // Handle the image submission logic
    if (selectedFile) {
      onImageSubmit(selectedFile);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <p>Share your memories with us! Upload your photos and images.</p>
      <span><Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit Image
      </Button>
      <Button variant="contained" color="primary" onClick={onClose}>
        Close
      </Button>
      </span>
    </div>
  );
};

export default Gallery;
