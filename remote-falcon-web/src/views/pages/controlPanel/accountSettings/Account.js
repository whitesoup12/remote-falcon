import { useState } from 'react';

import { useMutation } from '@apollo/client';
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Grid, CardActions, Divider, Typography, Modal, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';

import MainCard from 'ui-component/cards/MainCard';
import RFLoadingButton from 'ui-component/RFLoadingButton';

import useAuth from '../../../../hooks/useAuth';
import { deleteAccountService, requestApiAccessService } from '../../../../services/mutations.service';
import { useDispatch, useSelector } from '../../../../store';
import { setShow } from '../../../../store/slices/show';
import { DELETE_ACCOUNT, REQUEST_API_ACCESS } from '../../../../utils/graphql/mutations';
import { showAlert } from '../../globalPageHelpers';
import DeleteAccountModal from './DeleteAccount.modal';

const Account = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { show } = useSelector((state) => state.show);

  const [showShowToken, setShowShowToken] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [isRequestingApi, setIsRequestingApi] = useState(false);

  const [requestApiAccessMutation] = useMutation(REQUEST_API_ACCESS);
  const [deleteAccountMutation] = useMutation(DELETE_ACCOUNT);

  const copyShowToken = async () => {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(show?.showToken);
    } else {
      document.execCommand('copy', true, show?.showToken);
    }
    showAlert(dispatch, { message: 'Show Token Copied' });
  };

  const requestApiAccess = () => {
    setIsRequestingApi(true);
    const updatedApiAccess = _.cloneDeep({
      ...show?.apiAccess,
      apiAccessActive: true
    });
    requestApiAccessService(requestApiAccessMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            apiAccess: {
              ...updatedApiAccess
            }
          })
        );
      }
      showAlert(dispatch, response?.toast);
      setIsRequestingApi(false);
    });
  };

  const handleDeleteAccount = () => {
    setIsDeletingAccount(true);
    deleteAccountService(deleteAccountMutation, (response) => {
      if (response?.success) {
        setIsDeletingAccount(false);
        logout();
      } else {
        showAlert(dispatch, response?.toast);
      }
    });
  };

  return (
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
                <span style={{ fontSize: '1.2em' }}>{show?.showToken}</span>
              ) : (
                <span style={{ fontSize: '1.2em' }}>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</span>
              )}
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowShowToken(!showShowToken)}
                edge="end"
                size="small"
                sx={{ ml: 0.5 }}
              >
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
              <RFLoadingButton
                loading={isRequestingApi}
                onClick={requestApiAccess}
                color="primary"
                disabled={show?.apiAccess?.apiAccessActive}
              >
                {show?.apiAccess?.apiAccessActive ? <span>Access Requested</span> : <span>Request Access</span>}
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
              <RFLoadingButton onClick={() => setDeleteAccountOpen(true)} color="error">
                Delete Account
              </RFLoadingButton>
            </Grid>
          </Grid>
        </CardActions>
        <Divider />
      </MainCard>
      <Modal
        open={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <DeleteAccountModal
          theme={theme}
          handleClose={() => setDeleteAccountOpen(false)}
          deleteAccount={handleDeleteAccount}
          isDeleting={isDeletingAccount}
        />
      </Modal>
    </Grid>
  );
};

export default Account;
