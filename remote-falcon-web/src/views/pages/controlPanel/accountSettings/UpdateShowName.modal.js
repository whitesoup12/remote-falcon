import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import { CardContent, CardActions, Divider, Grid, IconButton, Typography, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

const UpdateEmailModal = ({ theme, handleClose, updateShowName, isUpdatingShowName, updatedShowName }) => (
  <MainCard
    sx={{
      position: 'absolute',
      width: { xs: 280, lg: 450 },
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}
    title="Update Show Name"
    content={false}
    secondary={
      <IconButton onClick={handleClose} size="large">
        <CloseIcon fontSize="small" />
      </IconButton>
    }
  >
    <CardContent>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Are you sure you want to update your show name to:
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
        {updatedShowName}
      </Typography>
      <Typography component="body2" sx={{ m: 0, color: 'red' }}>
        Warning! Changing your show name will also update your Viewer Page URL!
      </Typography>
      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        (You will be signed out after updating)
      </Typography>
    </CardContent>
    <Divider />
    <CardActions>
      <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
        <Grid item>
          <LoadingButton
            loading={isUpdatingShowName}
            loadingIndicator={<CircularProgress color="primary" size={30} />}
            variant="contained"
            size="large"
            sx={{ background: theme.palette.primary.main, '&:hover': { background: theme.palette.primary.dark } }}
            onClick={handleClose}
          >
            Cancel
          </LoadingButton>
        </Grid>
        <Grid item>
          <Grid container alignItems="center" justifyContent="flex-end" spacing={2}>
            <Grid item>
              <LoadingButton
                loading={isUpdatingShowName}
                loadingIndicator={<CircularProgress color="error" size={30} />}
                variant="contained"
                size="large"
                sx={{ background: theme.palette.error.main, '&:hover': { background: theme.palette.error.dark } }}
                onClick={updateShowName}
              >
                Update Show Name
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CardActions>
  </MainCard>
);

UpdateEmailModal.propTypes = {
  theme: PropTypes.object,
  handleClose: PropTypes.func,
  updateShowName: PropTypes.func,
  isUpdatingShowName: PropTypes.bool,
  updatedShowName: PropTypes.string
};

export default UpdateEmailModal;
