import { useState } from 'react';

import { useMutation } from '@apollo/client';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import { Grid, TextField, Typography, Modal } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';

import useAuth from 'hooks/useAuth';
import { saveShowService, saveUserProfileService } from 'services/controlPanel/mutations.service';
import { useDispatch, useSelector } from 'store';
import { gridSpacing } from 'store/constant';
import { setShow } from 'store/slices/show';
import Avatar from 'ui-component/extended/Avatar';
import { UPDATE_SHOW, UPDATE_USER_PROFILE } from 'utils/graphql/controlPanel/mutations';

import { showAlert } from '../../globalPageHelpers';
import UpdateEmailModal from './UpdateEmail.modal';
import UpdateShowNameModal from './UpdateShowName.modal';

const UserProfile = ({ gravatar, setShowLinearProgress }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { show } = useSelector((state) => state.show);

  const [email, setEmail] = useState(show?.email);
  const [showName, setShowName] = useState(show?.showName);
  const [firstName, setFirstName] = useState(show?.userProfile?.firstName);
  const [lastName, setLastName] = useState(show?.userProfile?.lastName);
  const [facebookUrl, setFacebookUrl] = useState(show?.userProfile?.facebookUrl);
  const [youtubeUrl, setYoutubeUrl] = useState(show?.userProfile?.youtubeUrl);

  const [updateEmailOpen, setUpdateEmailOpen] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [updateShowNameOpen, setUpdateShowNameOpen] = useState(false);
  const [isUpdatingShowName, setIsUpdatingShowName] = useState(false);

  const [updateShowMutation] = useMutation(UPDATE_SHOW);
  const [updateUserProfileMutation] = useMutation(UPDATE_USER_PROFILE);

  const handleEmailChange = () => {
    if (show?.email !== email) {
      setUpdateEmailOpen(true);
    }
  };

  const handleEmailUpdate = () => {
    setShowLinearProgress(true);
    setIsUpdatingEmail(true);
    const updatedShow = _.cloneDeep({
      ...show,
      email
    });
    saveShowService(updatedShow, updateShowMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...updatedShow
          })
        );
        showAlert(dispatch, response?.toast);
        setShowLinearProgress(false);
        setIsUpdatingEmail(false);
        logout();
      } else {
        showAlert(dispatch, response?.toast);
        setShowLinearProgress(false);
        setIsUpdatingEmail(false);
      }
    });
  };

  const handleEmailUpdateCancel = () => {
    setEmail(show?.email);
    setUpdateEmailOpen(false);
  };

  const handleShowNameChange = () => {
    if (show?.showName !== showName) {
      setUpdateShowNameOpen(true);
    }
  };

  const handleShowNameUpdate = () => {
    setShowLinearProgress(true);
    setIsUpdatingShowName(true);
    const updatedShow = _.cloneDeep({
      ...show,
      showName
    });
    saveShowService(updatedShow, updateShowMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...updatedShow
          })
        );
        showAlert(dispatch, response?.toast);
        setShowLinearProgress(false);
        setIsUpdatingShowName(false);
        logout();
      } else {
        showAlert(dispatch, response?.toast);
        setShowLinearProgress(false);
        setIsUpdatingShowName(false);
      }
    });
  };

  const handleShowNameUpdateCancel = () => {
    setShowName(show?.showName);
    setUpdateShowNameOpen(false);
  };

  const saveUserProfile = () => {
    setShowLinearProgress(true);
    const updatedUserProfile = _.cloneDeep({
      ...show?.userProfile,
      firstName,
      lastName,
      facebookUrl,
      youtubeUrl
    });
    saveUserProfileService(updatedUserProfile, updateUserProfileMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            userProfile: {
              ...updatedUserProfile
            }
          })
        );
      }
      showAlert(dispatch, response?.toast);
      setShowLinearProgress(false);
    });
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar alt="User 1" src={gravatar} sx={{ height: 80, width: 80 }} />
          </Grid>
          <Grid item sm zeroMinWidth>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="caption">
                  <ErrorTwoToneIcon sx={{ height: 16, width: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                  Image can be changed using{' '}
                  <a href="https://en.gravatar.com/" target="_blank" rel="noreferrer">
                    Gravatar
                  </a>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e?.target?.value)}
          onBlur={saveUserProfile}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Last Name" value={lastName} onChange={(e) => setLastName(e?.target?.value)} onBlur={saveUserProfile} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Show Name"
          value={showName}
          onChange={(e) => setShowName(e?.target?.value)}
          onBlur={handleShowNameChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Email Address" value={email} onChange={(e) => setEmail(e?.target?.value)} onBlur={handleEmailChange} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Facebook Show URL"
          value={facebookUrl}
          onChange={(e) => setFacebookUrl(e?.target?.value)}
          onBlur={saveUserProfile}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="YouTube Show URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e?.target?.value)}
          onBlur={saveUserProfile}
        />
      </Grid>
      <Modal
        open={updateEmailOpen}
        onClose={handleEmailUpdateCancel}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <UpdateEmailModal
          theme={theme}
          handleClose={handleEmailUpdateCancel}
          updateEmail={handleEmailUpdate}
          updatedEmail={email}
          isUpdatingEmail={isUpdatingEmail}
        />
      </Modal>
      <Modal
        open={updateShowNameOpen}
        onClose={handleShowNameUpdateCancel}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <UpdateShowNameModal
          theme={theme}
          handleClose={handleShowNameUpdateCancel}
          updateShowName={handleShowNameUpdate}
          updatedShowName={showName}
          isUpdatingShowName={isUpdatingShowName}
        />
      </Modal>
    </Grid>
  );
};

UserProfile.propTypes = {
  gravatar: PropTypes.object,
  setShowLinearProgress: PropTypes.func
};

export default UserProfile;
