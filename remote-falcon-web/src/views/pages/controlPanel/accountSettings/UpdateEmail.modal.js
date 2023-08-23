import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import { CardContent, CardActions, Divider, Grid, IconButton, Typography, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

const UpdateEmailModal = ({ theme, handleClose, updateEmail, isUpdatingEmail, isDemo, updatedEmail }) => (
  <MainCard
    sx={{
      position: 'absolute',
      width: { xs: 280, lg: 450 },
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}
    title="Update Email"
    content={false}
    secondary={
      <IconButton onClick={handleClose} size="large">
        <CloseIcon fontSize="small" />
      </IconButton>
    }
  >
    <CardContent>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Are you sure you want to update your email to:
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {updatedEmail}
      </Typography>
      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        (You will be signed out after updating and verification email will be sent to the updated email address)
      </Typography>
    </CardContent>
    <Divider />
    <CardActions>
      <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
        <Grid item>
          <LoadingButton
            loading={isUpdatingEmail}
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
                disabled={isDemo}
                loading={isUpdatingEmail}
                loadingIndicator={<CircularProgress color="error" size={30} />}
                variant="contained"
                size="large"
                sx={{ background: theme.palette.error.main, '&:hover': { background: theme.palette.error.dark } }}
                onClick={updateEmail}
              >
                Update Email
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
  updateEmail: PropTypes.func,
  isUpdatingEmail: PropTypes.bool,
  isDemo: PropTypes.bool,
  updatedEmail: PropTypes.string
};

export default UpdateEmailModal;
