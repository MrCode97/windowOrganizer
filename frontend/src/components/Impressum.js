// ImpressumPage.js
import { Typography, Box, Link } from '@mui/material';
import { useImpressumAsset, useImpressumString } from '../contexts/text';

function ImpressumPage() {
  const {
    title,
    responsibletitle,
    company,
    street,
    postalcode,
    country,
    providertitle,
    providername,
    provideraddress,
    providercontact,
    iptitle,
    iptext,
    dptitle,
    dptext,
    lawtitle,
    lawtext
  } = useImpressumString();
  const {
    link
  } = useImpressumAsset();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4, padding: 2 }}>
      <Typography className='pageTitle' variant="h4" align="center">
        { title }
      </Typography>

      <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
        { responsibletitle }
      </Typography>
      <Typography align="center">
        { company } <br />
        { street } <br />
        { postalcode } <br />
        { country } <br />
        <Link href="{ link }">{ link }</Link>
      </Typography>

      <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
        {providertitle}
      </Typography>
      <Typography align="center">
        {providername} <br />
        {provideraddress} <br />
        {providercontact}
      </Typography>

      {/* Intellectual Property */}
      <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
        {iptitle}
      </Typography>
      <Typography align="center">
        {iptext}
      </Typography>

      {/* Data Protection */}
      <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
        {dptitle}
      </Typography>
      <Typography align="center">
        {dptext}
      </Typography>

      {/* Applicable Law */}
      <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
        {lawtitle}
      </Typography>
      <Typography align="center">
        {lawtext}
      </Typography>
    </Box>
  );
}

export default ImpressumPage;
