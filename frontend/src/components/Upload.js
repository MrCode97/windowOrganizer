import { useState } from 'react';
import { Button, Snackbar, Checkbox, FormControlLabel } from '@mui/material';
import { useUploadStrings } from '../contexts/text';

const UploadImage = ({ calendarId, windowNr, onClose, imageUpload, setImageUpload, token }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const { hintLogin, hintImgShrink, hintUpload, hintUploadError, hintConsent, title, consent, submit } = useUploadStrings();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) { // Server limit 2MB
      resizeImage(file).then((resizedFile) => {
        setSelectedFile(resizedFile);
      });
    } else {
      setSelectedFile(file);
    }
  };

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob.size <= 2 * 1024 * 1024) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              setMessage({hintImgShrink});
              setMessageOpen(true);
              resolve(null);
            }
          }, file.type, 0.8);
        };
      };

      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!consentChecked) {
      setMessage({hintConsent});
      setMessageOpen(true);
      return;
    }

    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/pictures?calendar_id=${calendarId}&window_nr=${windowNr}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, },
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setImageUpload(!imageUpload);
          setSelectedFile(null);
          setMessage({hintUpload});
          setMessageOpen(true);
        } else {
          setMessage({hintUploadError});
          setMessageOpen(true);
        }
      } catch (error) {
        setMessage({hintUploadError});
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
          <p>{title}</p>
          <FormControlLabel
            control={<Checkbox checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} />}
            label={consent}
            sx={{ marginBottom: '10px' }}
          />
          <Button variant="contained" sx={{ backgroundColor: 'green' }} onClick={handleSubmit}>
            {submit}
          </Button>
          <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
        </>
      ) : (
        <>
          <input disabled type="file" onChange={handleFileChange} />
          <p>{title}</p>
          <Button disabled variant="contained" style={{ backgroundColor: 'gray' }}>
            {hintLogin}
          </Button>
          <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
        </>
      )}
    </div>
  );
};

export { UploadImage };
