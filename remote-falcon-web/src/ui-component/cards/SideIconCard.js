import { Card, Grid, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

const SideIconCard = ({ iconPrimary, primary, secondary, secondarySub, color, bgcolor }) => {
  const theme = useTheme();
  const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));

  const IconPrimary = iconPrimary;
  const primaryIcon = iconPrimary !== undefined ? <IconPrimary /> : null;

  return (
    <Card sx={{ bgcolor: bgcolor || '', position: 'relative' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={4} sx={{ background: color, py: 3.5, px: 0 }}>
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              color: '#fff',
              '& > svg': {
                width: 32,
                height: 32
              }
            }}
            align="center"
          >
            {primaryIcon}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Grid container direction="column" justifyContent="space-between" spacing={1} alignItems={matchDownXs ? 'center' : 'flex-start'}>
            <Grid item sm={12}>
              <Typography variant="h3" sx={{ color: bgcolor ? '#fff' : '', ml: 2 }}>
                {primary}
              </Typography>
            </Grid>
            <Grid item sm={12}>
              <Typography variant="body2" align="left" sx={{ color: bgcolor ? '#fff' : 'grey.700', ml: 2 }}>
                {secondary} <span style={{ color }}>{secondarySub}</span>{' '}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

SideIconCard.propTypes = {
  iconPrimary: PropTypes.object,
  primary: PropTypes.string,
  secondary: PropTypes.string,
  secondarySub: PropTypes.string,
  color: PropTypes.string,
  bgcolor: PropTypes.string
};

export default SideIconCard;
