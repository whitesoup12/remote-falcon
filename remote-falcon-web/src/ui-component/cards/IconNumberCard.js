import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';

import MainCard from './MainCard';

const IconNumberCard = ({ title, primary, color, iconPrimary }) => {
  const IconPrimary = iconPrimary;
  const primaryIcon = iconPrimary ? <IconPrimary /> : null;

  return (
    <MainCard>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="subtitle2" sx={{ color }}>
                {primaryIcon}
              </Typography>
              <Typography variant="h5" color="inherit">
                {title}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h3">{primary}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

IconNumberCard.propTypes = {
  title: PropTypes.string,
  primary: PropTypes.string,
  color: PropTypes.string,
  iconPrimary: PropTypes.object
};

export default IconNumberCard;
