import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import { CardContent, CardActions, Divider, Grid, IconButton, Typography } from '@mui/material';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

const ImportantAnalytics = ({ theme, handleClose }) => (
  <MainCard
    sx={{
      position: 'absolute',
      width: { xs: 280, lg: 600 },
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}
    content={false}
    secondary={
      <IconButton onClick={handleClose} size="large">
        <CloseIcon fontSize="small" />
      </IconButton>
    }
  >
    <CardContent>
      <Typography variant="h3" sx={{ mt: 2, mb: 2 }}>
        Not sure how you found this, but...
      </Typography>
      <img
        src="https://media0.giphy.com/media/eKNrUbDJuFuaQ1A37p/giphy.gif?cid=ecf05e47nig1j5u4gevrpfaskzeuvtjyq2wabc8dd7tdo4rj&ep=v1_gifs_search&rid=giphy.gif&ct=g"
        alt="impressive"
        style={{ width: '100%' }}
      />
    </CardContent>
    <Divider />
    <CardActions>
      <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
        <Grid item>
          <LoadingButton
            variant="contained"
            size="large"
            sx={{ background: theme.palette.primary.main, '&:hover': { background: theme.palette.primary.dark } }}
            onClick={handleClose}
          >
            Thank You!
          </LoadingButton>
        </Grid>
      </Grid>
    </CardActions>
  </MainCard>
);

ImportantAnalytics.propTypes = {
  theme: PropTypes.object,
  handleClose: PropTypes.func
};

export default ImportantAnalytics;
