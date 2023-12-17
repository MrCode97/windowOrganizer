import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import React, { useState, useEffect } from 'react';

const Gallery = ({ calendarId, windowNr }) => {
const [images, setImages] = useState([]);

  useEffect(() => {
    console.log('Fetching images for window', windowNr);
    const fetchImages = async () => {
      try {
        const response = await fetch(`http://localhost:7007/api/get-all-pictures/${calendarId}/${windowNr}`);
        const data = await response.json();

        if (data.success) {
            const base64Images = data.pictures.map(imageObject => {
                const arrayBuffer = Uint8Array.from(imageObject.data).buffer;
                const blob = new Blob([arrayBuffer], { type: 'image/png' });
                const reader = new FileReader();
                return new Promise((resolve) => {
                  reader.onloadend = () => {
                    resolve(reader.result);
                  };
                  reader.readAsDataURL(blob);
                });
              });
        
              Promise.all(base64Images).then(images => {
                setImages(images || []);
              });
        } else {
          console.error('Failed to fetch images:', data.message);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [calendarId, windowNr]);

  return (
    <div>
        <p>Here you can see all the images that have been uploaded for this window.</p>
        <Grid container spacing={2}>
        {images.map((image, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
            <Card>
                <CardMedia
                component="img"
                alt={`Image ${index}`}
                height="140"
                image={image}
                />
            </Card>
            </Grid>
        ))}
        </Grid>
    </div>
  );
};

export { Gallery };