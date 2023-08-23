import { useState, useEffect } from 'react';

import { Box, CardContent, Divider, Grid, LinearProgress, Modal } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import md5 from 'md5';
import { useKeys } from 'rooks';

import useAuth from 'hooks/useAuth';
import { useDispatch, useSelector } from 'store';
import { gridSpacing } from 'store/constant';
import { startFetchCoreInfoAction } from 'store/slices/account';
import MainCard from 'ui-component/cards/MainCard';
import UserProfileSkeleton from 'ui-component/cards/Skeleton/UserProfileSkeleton';
import { RFTabPanel, RFTab } from 'ui-component/RFTabPanel';
import { mixpanelTrack } from 'views/pages/globalPageHelpers';

import Account from './Account';
import ChangePassword from './ChangePassword';
import {
  handleInputChange,
  handleOpen,
  handleClose,
  handleUpdateEmailOpen,
  handleUpdateEmailClose,
  updateEmail,
  handleClickShowRemoteToken,
  tabOptions,
  saveProfile,
  requestApiAccess,
  deleteAccount,
  updatePassword,
  handleImportantAnalyticsClose,
  importantAnalytics,
  copyRemoteToken
} from './helpers';
import ImportantAnalytics from './ImportantAnalytics.modal';
import UserProfile from './UserProfile';

const AccountSettings = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { coreInfo, isDemo } = useSelector((state) => state.account);

  const [open, setOpen] = useState(false);
  const [updateEmailOpen, setUpdateEmailOpen] = useState(false);
  const [importantAnalyticsOpen, setImportantAnalyticsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLinearProgress, setShowLinearProgress] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isRequestingApi, setIsRequestingApi] = useState(false);
  const [changePasswordEnabled, setChangePasswordEnabled] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showRemoteToken, setShowRemoteToken] = useState(false);
  const [gravatar, setGravatar] = useState();
  const [userProfile, setUserProfile] = useState({
    firstName: coreInfo?.firstName,
    lastName: coreInfo?.lastName,
    showName: coreInfo?.remoteName,
    email: coreInfo?.email,
    facebookUrl: coreInfo?.facebookUrl,
    youtubeUrl: coreInfo?.youtubeUrl,
    currentPassword: '',
    newPassword: ''
  });

  useKeys(['KeyA', 'KeyC', 'KeyN', 'KeyF', 'KeyO', 'KeyL'], () => {
    setImportantAnalyticsOpen(true);
    importantAnalytics();
  });

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      mixpanelTrack('Account Settings Page View', coreInfo);
      const hashedEmail = coreInfo?.email ? md5(coreInfo?.email, { encoding: 'binary' }) : '';
      const gravatar = `//www.gravatar.com/avatar/${hashedEmail}?r=pg&d=identicon`;
      setGravatar(gravatar);
      setChangePasswordEnabled(userProfile?.currentPassword !== '' && userProfile?.newPassword !== '');
      setIsLoading(false);
    };
    init();
  }, [coreInfo, userProfile?.currentPassword, userProfile?.newPassword]);

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard title="Account Settings" content={false}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                {showLinearProgress && <LinearProgress />}
              </Grid>
              <Grid item xs={12} lg={4}>
                <CardContent>
                  <RFTabPanel tabOptions={tabOptions} orientation="vertical" />
                </CardContent>
              </Grid>
              <Grid item xs={12} lg={8}>
                <CardContent
                  sx={{
                    borderLeft: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[200],
                    height: '100%'
                  }}
                >
                  <RFTab index={0}>
                    {isLoading ? (
                      <UserProfileSkeleton />
                    ) : (
                      <UserProfile
                        theme={theme}
                        gravatar={gravatar}
                        coreInfo={coreInfo}
                        isDemo={isDemo}
                        updateEmail={() =>
                          updateEmail(dispatch, coreInfo, setIsUpdatingEmail, logout, userProfile, setUpdateEmailOpen, setUserProfile)
                        }
                        isUpdatingEmail={isUpdatingEmail}
                        saveProfile={() => saveProfile(dispatch, userProfile, setShowLinearProgress, startFetchCoreInfoAction)}
                        userProfile={userProfile}
                        handleInputChange={(event, value) => handleInputChange(event, value, setUserProfile, userProfile)}
                        handleUpdateEmailOpen={() => handleUpdateEmailOpen(setUpdateEmailOpen, coreInfo?.email, userProfile?.email)}
                        handleUpdateEmailClose={() => handleUpdateEmailClose(setUpdateEmailOpen, coreInfo, userProfile, setUserProfile)}
                        updateEmailOpen={updateEmailOpen}
                      />
                    )}
                  </RFTab>
                  <RFTab index={1}>
                    <Account
                      theme={theme}
                      open={open}
                      handleOpen={() => handleOpen(setOpen)}
                      handleClose={() => handleClose(setOpen)}
                      deleteAccount={() => deleteAccount(dispatch, coreInfo, setIsDeleting, logout)}
                      isDeleting={isDeleting}
                      isDemo={isDemo}
                      requestApiAccess={() => requestApiAccess(dispatch, setIsRequestingApi)}
                      isRequestingApi={isRequestingApi}
                      remoteToken={coreInfo?.remoteToken}
                      showRemoteToken={showRemoteToken}
                      handleClickShowRemoteToken={() => handleClickShowRemoteToken(setShowRemoteToken, showRemoteToken)}
                      copyRemoteToken={() => copyRemoteToken(dispatch, coreInfo)}
                    />
                  </RFTab>
                  <RFTab index={2}>
                    <ChangePassword
                      changePassword={() => updatePassword(dispatch, userProfile, setIsChangingPassword, logout)}
                      handleInputChange={(event, value) => handleInputChange(event, value, setUserProfile, userProfile)}
                      isChangingPassword={isChangingPassword}
                      changePasswordEnabled={changePasswordEnabled}
                    />
                  </RFTab>
                </CardContent>
              </Grid>
            </Grid>
            <Divider />
          </MainCard>
        </Grid>
      </Grid>
      <Modal
        open={importantAnalyticsOpen}
        onClose={handleImportantAnalyticsClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ImportantAnalytics theme={theme} handleClose={() => handleImportantAnalyticsClose(setImportantAnalyticsOpen)} />
      </Modal>
    </Box>
  );
};

export default AccountSettings;
