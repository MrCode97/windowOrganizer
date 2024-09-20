import Grid2 from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';

const Gallery = ({ calendarId, windowNr, token, isOwner }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getPictures?calendar_id=${calendarId}&window_nr=${windowNr}`);
        const data = await response.json();
        setImages(data.pictures || []);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [calendarId, windowNr]);

  const handleDeleteImage = async (pictureId) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delPicture`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ pictureId }),
      });
      setImages(images.filter((image) => image.id !== pictureId));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div>
      <p>Here you can see all the images that have been uploaded for this window.</p>
      <Grid2 container spacing={2}>
        {images.map((image, index) => (
          <Grid2 item key={index} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia component="img" alt={`Image ${index}`} height="140" image={image.url} />
              {(token === image.author || isOwner) && (
                <IconButton onClick={() => handleDeleteImage(image.id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
};

export { Gallery };
