import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Grid, CardActions, Divider, Typography, Modal, IconButton, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';
import RFLoadingButton from 'ui-component/RFLoadingButton';

import DeleteAccountModal from './DeleteAccount.modal';

const Account = ({
  theme,
  open,
  handleOpen,
  handleClose,
  deleteAccount,
  isDeleting,
  isDemo,
  requestApiAccess,
  isRequestingApi,
  showToken,
  showShowToken,
  handleClickShowShowToken,
  copyShowToken
}) => (
  <Grid item xs={12}>
    <MainCard content={false}>
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="h4" sx={{ m: 0 }}>
              Show Token
            </Typography>
            <Typography component="div" variant="caption">
              This is your Show Token that will be used in the FPP or xSchedule plugins.
              <br />
              Treat this token like a password, as it allows FPP and xSchedule to communicate with your show page!
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            {showShowToken ? (
              <span style={{ fontSize: '1.2em' }}>{showToken}</span>
            ) : (
              <span style={{ fontSize: '1.2em' }}>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</span>
            )}
            <IconButton aria-label="toggle password visibility" onClick={handleClickShowShowToken} edge="end" size="small" sx={{ ml: 0.5 }}>
              {showShowToken ? <Visibility /> : <VisibilityOff />}
            </IconButton>
            <Tooltip placement="top" title="Copy Show Token">
              <IconButton aria-label="copy show token" onClick={copyShowToken} edge="end" size="small" sx={{ ml: 0.5 }}>
                <ContentCopyTwoToneIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </CardActions>
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="h4" sx={{ m: 0 }}>
              Request API Access
            </Typography>
            <Typography component="div" variant="caption">
              Request access to the Remote Falcon API so you can integrate into your own website.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <RFLoadingButton loading={isRequestingApi} onClick={requestApiAccess} color="primary">
              Request Access
            </RFLoadingButton>
          </Grid>
        </Grid>
      </CardActions>
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="h4" sx={{ m: 0 }}>
              Delete Account
            </Typography>
            <Typography component="div" variant="caption" sx={{ m: 0, color: 'red' }}>
              Warning! This cannot be undone!
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <RFLoadingButton onClick={handleOpen} color="error">
              Delete Account
            </RFLoadingButton>
          </Grid>
        </Grid>
      </CardActions>
      <Divider />
    </MainCard>
    <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
      <DeleteAccountModal theme={theme} handleClose={handleClose} deleteAccount={deleteAccount} isDeleting={isDeleting} isDemo={isDemo} />
    </Modal>
  </Grid>
);

Account.propTypes = {
  theme: PropTypes.object,
  open: PropTypes.bool,
  handleOpen: PropTypes.func,
  handleClose: PropTypes.func,
  deleteAccount: PropTypes.func,
  isDeleting: PropTypes.bool,
  isDemo: PropTypes.bool,
  requestApiAccess: PropTypes.func,
  isRequestingApi: PropTypes.bool,
  showToken: PropTypes.string,
  showShowToken: PropTypes.bool,
  handleClickShowShowToken: PropTypes.func,
  copyShowToken: PropTypes.func
};

export default Account;
