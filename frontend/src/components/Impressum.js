// ImpressumPage.js
import { Typography, Box, Link } from '@mui/material';

function ImpressumPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4, padding: 2 }}>
      <Typography className='pageTitle' variant="h4" align="center">
        Legal Notice (Impressum)
      </Typography>

      <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
        Identity of the Responsible Person:
      </Typography>
      <Typography align="center">
        [Your Company Name] <br />
        [Street Address] <br />
        [Postal Code, City] <br />
        Switzerland <br />
        Contact: <Link href="mailto:email@example.com">email@example.com</Link>
      </Typography>

      <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
        Hosting Provider:
      </Typography>
      <Typography align="center">
        [Hosting Company Name] <br />
        [Hosting Address] <br />
        Contact: [Hosting Email or Phone]
      </Typography>

      {/* Intellectual Property */}
      <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
        Intellectual Property:
      </Typography>
      <Typography align="center">
        All content on this website, including text, images, and code, is protected by copyright law. 
        Unauthorized use or reproduction is prohibited.
      </Typography>

      {/* Data Protection */}
      <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
        Data Protection and Privacy:
      </Typography>
      <Typography align="center">
        We are committed to protecting your privacy. Please refer to our{' '}
        <Link href="/privacy-policy">Privacy Policy</Link> for details on how we collect and use personal data.
      </Typography>

      {/* Applicable Law */}
      <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
        Applicable Law:
      </Typography>
      <Typography align="center">
        This website is governed by Swiss law. Any disputes arising from the use of this website will be subject to the jurisdiction of the courts in [Basel, Switzerland].
      </Typography>
    </Box>
  );
}

export default ImpressumPage;
