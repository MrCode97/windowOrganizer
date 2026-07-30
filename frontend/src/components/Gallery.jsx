import Grid2 from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { useState, useEffect, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useGalleryStrings } from '../contexts/text';

const Gallery = ({ calendarId, windowNr, imageUpload, setImageUpload, token, calendarOwnerId }) => {
  const [images, setImages] = useState([]);
  const [isCalendarOwner, setIsCalendarOwner] = useState(false);
  const [userId, setUserId] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { title, altText, imageCounter } = useGalleryStrings();

  useEffect(() => {
    if (token) {
      async function fetchUserId() {
        try {
          const username = localStorage.getItem('user');
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/user/userToId?user=${username}`, {
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
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/getPictures?calendar_id=${calendarId}&window_nr=${windowNr}`);
        const data = await response.json();

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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/delPicture?picture_id=${pictureId}&calendar_id=${calendarId}&window_nr=${windowNr}`, {
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
      console.error('Error deleting picture:', error);
    }
  };

  const handleDeleteFromDialog = async (pictureId) => {
    const remainingImages = images.filter((image) => image.id !== pictureId);
    const nextIndex = selectedIndex >= remainingImages.length
      ? remainingImages.length - 1
      : selectedIndex;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/delPicture?picture_id=${pictureId}&calendar_id=${calendarId}&window_nr=${windowNr}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setImages(remainingImages);
        setImageUpload(!imageUpload);
        if (remainingImages.length === 0) {
          setOpen(false);
          setSelectedIndex(null);
        } else {
          setSelectedIndex(nextIndex);
          setImageLoaded(false);
        }
      }
    } catch (error) {
      console.error('Error deleting picture:', error);
    }
  };

  const canDelete = (image) => userId === image.author || isCalendarOwner;

  const handleOpenDialog = (index) => {
    setSelectedIndex(index);
    setImageLoaded(false);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedIndex(null);
  };

  const handleDownloadImage = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    if (selectedIndex === null || !images[selectedIndex]) return;
    const link = document.createElement('a');
    link.href = images[selectedIndex].url;
    link.download = `${altText}_${selectedIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => {
      setImageLoaded(false);
      return prev > 0 ? prev - 1 : images.length - 1;
    });
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => {
      setImageLoaded(false);
      return prev < images.length - 1 ? prev + 1 : 0;
    });
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goToPrevious(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goToNext(); }
      else if (e.key === 'Escape') { handleCloseDialog(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, goToPrevious, goToNext]);

  return (
    <div>
      <p>{title}</p>
      <Grid2 container spacing={2}>
        {images.map((image, index) => (
          <Grid2 item key={image.id} xs={12} sm={6} md={4}>
            <Card sx={{ position: 'relative', overflow: 'hidden' }}>
              <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 40,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)',
                zIndex: 1, pointerEvents: 'none',
              }} />
              <IconButton
                onClick={() => handleDownloadImage(image.url, `${altText}_${index + 1}.jpg`)}
                sx={{
                  position: 'absolute', top: 4, left: 4, zIndex: 2,
                  color: 'white', backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                  width: 32, height: 32,
                }}>
                <DownloadIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <CardMedia
                component="img"
                alt={`${altText} ${index + 1}`}
                height="180"
                image={image.url}
                onClick={() => handleOpenDialog(index)}
                sx={{ cursor: 'pointer', objectFit: 'cover' }}
              />
              {canDelete(image) && (
                <IconButton
                  onClick={() => handleDeleteImage(image.id)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                    zIndex: 2,
                    width: 32,
                    height: 32,
                  }}>
                  <DeleteIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}
            </Card>
          </Grid2>
        ))}
      </Grid2>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="lg" fullWidth
        sx={{
          zIndex: 9999,
          '& .MuiDialog-paper': { backgroundColor: 'transparent', boxShadow: 'none', overflow: 'visible' },
        }}>
        <DialogContent sx={{ padding: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          {selectedIndex !== null && images[selectedIndex] && (
            <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '90vw', maxHeight: '85vh' }}>
              <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, display: 'flex', gap: 1 }}>
                {canDelete(images[selectedIndex]) && (
                  <IconButton
                    onClick={() => handleDeleteFromDialog(images[selectedIndex].id)}
                    sx={{ color: 'white', backgroundColor: 'rgb(60,60,60)', '&:hover': { backgroundColor: 'rgb(200,20,20)' } }}>
                    <DeleteIcon />
                  </IconButton>
                )}
                <IconButton
                  onClick={handleDownload}
                  sx={{ color: 'white', backgroundColor: 'rgb(60,60,60)', '&:hover': { backgroundColor: 'rgb(80,80,80)' } }}>
                  <DownloadIcon />
                </IconButton>
                <IconButton
                  onClick={handleCloseDialog}
                  sx={{ color: 'white', backgroundColor: 'rgb(60,60,60)', '&:hover': { backgroundColor: 'rgb(80,80,80)' } }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              {images.length > 1 && (
                <IconButton
                  onClick={goToPrevious}
                  sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: 'white', backgroundColor: 'rgb(60,60,60)', '&:hover': { backgroundColor: 'rgb(80,80,80)' } }}>
                  <ArrowBack />
                </IconButton>
              )}
              <Box
                component="img"
                src={images[selectedIndex].url}
                alt={`${altText} ${selectedIndex + 1}`}
                onLoad={() => setImageLoaded(true)}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  borderRadius: 1,
                  display: imageLoaded ? 'block' : 'none',
                }}
              />
              {images.length > 1 && (
                <Typography variant="body2" sx={{ mt: 1, color: 'white', backgroundColor: 'rgb(60,60,60)', px: 2, py: 0.5, borderRadius: 1, alignSelf: 'center' }}>
                  {imageCounter.replace('{current}', String(selectedIndex + 1)).replace('{total}', String(images.length))}
                </Typography>
              )}
              {images.length > 1 && (
                <IconButton
                  onClick={goToNext}
                  sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: 'white', backgroundColor: 'rgb(60,60,60)', '&:hover': { backgroundColor: 'rgb(80,80,80)' } }}>
                  <ArrowForward />
                </IconButton>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { Gallery };
