import Grid2 from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useGalleryStrings } from '../contexts/text';

const Gallery = ({ calendarId, windowNr, imageUpload, setImageUpload, token, calendarOwnerId }) => {
  const [images, setImages] = useState([]);
  const [isCalendarOwner, setIsCalendarOwner] = useState(false);
  const [userId, setUserId] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { title, altText } = useGalleryStrings();
  
  useEffect(() => {
    if (token) {
      async function fetchUserId() {
        try {
          const username = localStorage.getItem('user');
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/user/userToId?user=${username}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();
          setUserId(data.id);
          if (data.id !== undefined && data.id === calendarOwnerId) {
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
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/getPictures?calendar_id=${calendarId}&window_nr=${windowNr}`);
        const data = await response.json();

        // Convert each image content (Buffer-like) to base64
        const picturesWithUrls = await Promise.all(
          data.pictures.map((picture) => {
            return new Promise((resolve) => {
              const uint8Array = new Uint8Array(picture.content.data);
              const arrayBuffer = uint8Array.buffer;
              const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });

              const reader = new FileReader();
              reader.onloadend = () => {
                const imageUrl = reader.result;
                resolve({
                  ...picture,
                  url: imageUrl,
                });
              };
              reader.readAsDataURL(blob);
            });
          })
        );

        setImages(picturesWithUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [calendarId, windowNr]);


  const handleDeleteImage = async (pictureId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/delPicture?picture_id=${pictureId}&calendar_id=${calendarId}&window_nr=${windowNr}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setImages(images.filter((image) => image.id !== pictureId));
        setImageUpload(!imageUpload);
      } else {
        console.error('Failed to delete picture:', data.message);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };


  const handleOpenDialog = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <div>
      <p>{title}</p>
      <Grid2 container spacing={2}>
        {images.map((image, index) => (
          <Grid2 item key={index} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                alt={`${altText} ${index}`}
                height="140"
                image={image.url}
                onClick={() => handleOpenDialog(image.url)}
                style={{ cursor: 'pointer' }}
              />
                  <Dialog open={open} onClose={handleCloseDialog} maxWidth="lg"
                  sx={{ zIndex: 9999 }}>
                    <DialogContent>
                      <img src={selectedImage} alt="Enlarged" style={{ width: '100%' }} />
                    </DialogContent>
                  </Dialog>
              
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
