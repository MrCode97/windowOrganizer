import Grid2 from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';

const Gallery = ({ calendarId, windowNr, imageUpload, setImageUpload, token, calendarOwnerId }) => {
  const [images, setImages] = useState([]);
  const [isCalendarOwner, setIsCalendarOwner] = useState(false);
  const [userId, setUserId] = useState(null);

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
          if (data.id !== undefined && data.id === calendarOwnerId) {
            console.log(data.id);
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
    const fetchImages = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getPictures?calendar_id=${calendarId}&window_nr=${windowNr}`);
        const data = await response.json();

        // Convert each image content (Buffer-like) to base64
        const picturesWithUrls = data.pictures.map((picture) => {
          const uint8Array = new Uint8Array(picture.content.data);
          const base64String = btoa(String.fromCharCode(...uint8Array));
          const imageUrl = `data:image/jpeg;base64,${base64String}`;
          return {
            ...picture,
            url: imageUrl,  // Adding a url field for the image
          };
        });

        setImages(picturesWithUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [calendarId, windowNr]);

  const handleDeleteImage = async (pictureId) => {
    try {
      console.log(calendarId, windowNr);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delPicture?picture_id=${pictureId}&calendar_id=${calendarId}&window_nr=${windowNr}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setImages(images.filter((image) => image.id !== pictureId));
        setImageUpload(!imageUpload);
        console.log('Picture deleted successfully.');
      } else {
        console.error('Failed to delete picture:', data.message);
      }
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
              {(userId === image.author || isCalendarOwner) && (
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
