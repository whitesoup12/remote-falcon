import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';

import {
  saveUserProfileService,
  coreInfoService,
  deleteAccountService,
  updateEmailService,
  requestApiAccessService,
  updatePasswordService,
  importantAnalyticsService
} from 'services/controlPanel/accountSettings.service';
import { showAlert, mixpanelTrack } from 'views/pages/globalPageHelpers';

export const handleInputChange = (event, value, setUserProfile, userProfile) => {
  setUserProfile({
    ...userProfile,
    [event?.target?.name]: event?.target?.value
  });
};

export const handleOpen = (setOpen) => {
  setOpen(true);
};
export const handleClose = (setOpen) => {
  setOpen(false);
};

export const handleUpdateEmailOpen = (seUpdateEmailOpen, currentEmail, updatedEmail) => {
  if (currentEmail !== updatedEmail) {
    seUpdateEmailOpen(true);
  }
};
export const handleUpdateEmailClose = (setUpdateEmailOpen, coreInfo, userProfile, setUserProfile) => {
  setUserProfile({
    ...userProfile,
    email: coreInfo?.email
  });
  setUpdateEmailOpen(false);
};

export const handleImportantAnalyticsClose = (setImportantAnalyticsOpen) => {
  setImportantAnalyticsOpen(false);
};

export const handleClickShowRemoteToken = (setShowRemoteToken, showRemoteToken) => {
  setShowRemoteToken(!showRemoteToken);
};

export const tabOptions = [
  {
    label: 'User Profile',
    icon: <PersonOutlineTwoToneIcon />,
    caption: 'Main user settings'
  },
  {
    label: 'Account',
    icon: <DescriptionTwoToneIcon />,
    caption: 'Remote Token and other account settings'
  },
  {
    label: 'Change Password',
    icon: <VpnKeyTwoToneIcon />,
    caption: 'Change password'
  }
];

export const saveProfile = async (dispatch, userProfile, setShowLinearProgress, startFetchCoreInfoAction) => {
  setShowLinearProgress(true);
  await saveUserProfileService(userProfile);
  const coreInfoResponse = await coreInfoService();
  if (coreInfoResponse?.status === 200) {
    showAlert({ dispatch, message: 'User Profile Saved' });
    const coreInfo = coreInfoResponse.data;
    dispatch(
      startFetchCoreInfoAction({
        coreInfo
      })
    );
  } else {
    showAlert({ dispatch, alert: 'error' });
  }
  setShowLinearProgress(false);
};

export const requestApiAccess = async (dispatch, setIsRequestingApi) => {
  setIsRequestingApi(true);
  try {
    const response = await requestApiAccessService();
    if (response?.status === 200) {
      showAlert({ dispatch, message: 'API Access Requested' });
    } else if (response?.status === 204) {
      showAlert({ dispatch, alert: 'warning', message: 'API Access Already Requested' });
    } else {
      showAlert({ dispatch, alert: 'error' });
    }
  } catch (err) {
    if (err?.response?.status === 403) {
      showAlert({ dispatch, message: 'Unable to send API Access email', alert: 'error' });
    } else {
      showAlert({ dispatch, alert: 'error' });
    }
  }
  setIsRequestingApi(false);
};

export const deleteAccount = async (dispatch, coreInfo, setIsDeleting, logout) => {
  setIsDeleting(true);
  const response = await deleteAccountService();
  mixpanelTrack('Delete Account', coreInfo);
  if (response?.status === 200) {
    logout();
  } else {
    showAlert({ dispatch, alert: 'error' });
  }
  setIsDeleting(false);
};

export const updateEmail = async (dispatch, coreInfo, setIsUpdatingEmail, logout, userProfile, setUpdateEmailOpen, setUserProfile) => {
  setIsUpdatingEmail(true);
  const response = await updateEmailService(userProfile?.email);
  mixpanelTrack('Update Email', coreInfo);
  if (response?.status === 200) {
    showAlert({ dispatch, message: 'Email updated and verification email sent', alert: 'success' });
    setTimeout(() => {
      logout();
    }, 500);
  } else {
    showAlert({ dispatch, message: 'Cannot update email', alert: 'error' });
  }
  setUserProfile({
    ...userProfile,
    email: coreInfo?.email
  });
  setIsUpdatingEmail(false);
  setUpdateEmailOpen(false);
};

export const updatePassword = async (dispatch, userProfile, setIsChangingPassword, logout) => {
  setIsChangingPassword(true);
  const currentPasswordBase64 = Buffer.from(userProfile?.currentPassword, 'binary').toString('base64');
  const newPasswordBase64 = Buffer.from(userProfile?.newPassword, 'binary').toString('base64');
  const response = await updatePasswordService(currentPasswordBase64, newPasswordBase64);
  if (response?.status === 200) {
    logout();
  } else {
    showAlert({ dispatch, alert: 'error' });
  }
  setIsChangingPassword(false);
};

export const importantAnalytics = async () => {
  importantAnalyticsService();
};

export const copyRemoteToken = async (dispatch, coreInfo) => {
  if ('clipboard' in navigator) {
    await navigator.clipboard.writeText(coreInfo?.remoteToken);
  } else {
    document.execCommand('copy', true, coreInfo?.remoteToken);
  }
  showAlert({ dispatch, message: 'Remote Token Copied' });
  mixpanelTrack('Viewer Page HTML Copied', coreInfo);
};
