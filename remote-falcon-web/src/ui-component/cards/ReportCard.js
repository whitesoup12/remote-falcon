import { Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

import MainCard from './MainCard';

const ReportCard = ({ primary, secondary, iconPrimary, color }) => {
  const IconPrimary = iconPrimary;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;

  return (
    <MainCard>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Stack spacing={1}>
            <Typography variant="h3">{primary}</Typography>
            <Typography variant="body1">{secondary}</Typography>
          </Stack>
        </Grid>
        <Grid item>
          <Typography variant="h2" style={{ color }}>
            {primaryIcon}
          </Typography>
        </Grid>
      </Grid>
    </MainCard>
  );
};

ReportCard.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  iconPrimary: PropTypes.object,
  color: PropTypes.string
};

export default ReportCard;
