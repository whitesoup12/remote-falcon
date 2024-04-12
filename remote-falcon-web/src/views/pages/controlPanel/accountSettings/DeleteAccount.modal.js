import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import { CardContent, CardActions, Divider, Grid, IconButton, Typography, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

const DeleteAccountModal = ({ theme, handleClose, deleteAccount, isDeleting }) => (
  <MainCard
    sx={{
      position: 'absolute',
      width: { xs: 280, lg: 450 },
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}
    title="Delete Account"
    content={false}
    secondary={
      <IconButton onClick={handleClose} size="large">
        <CloseIcon fontSize="small" />
      </IconButton>
    }
  >
    <CardContent>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Are you sure you want to do this? There&apos;s no going back once it&apos;s done!
      </Typography>
    </CardContent>
    <Divider />
    <CardActions>
      <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
        <Grid item>
          <LoadingButton
            loading={isDeleting}
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
                loading={isDeleting}
                loadingIndicator={<CircularProgress color="error" size={30} />}
                variant="contained"
                size="large"
                sx={{ background: theme.palette.error.main, '&:hover': { background: theme.palette.error.dark } }}
                onClick={deleteAccount}
              >
                Delete Account
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CardActions>
  </MainCard>
);

DeleteAccountModal.propTypes = {
  theme: PropTypes.object,
  handleClose: PropTypes.func,
  deleteAccount: PropTypes.func,
  isDeleting: PropTypes.bool
};

export default DeleteAccountModal;
