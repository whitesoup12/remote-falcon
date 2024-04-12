import { useState, useEffect } from 'react';

import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';
import { Box, CardContent, Divider, Grid, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import md5 from 'md5';

import { useSelector } from 'store';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import UserProfileSkeleton from 'ui-component/cards/Skeleton/UserProfileSkeleton';
import { RFTabPanel, RFTab } from 'ui-component/RFTabPanel';

import Account from './Account';
import ChangePassword from './ChangePassword';
import UserProfile from './UserProfile';

const tabOptions = [
  {
    label: 'User Profile',
    icon: <PersonOutlineTwoToneIcon />,
    caption: 'Main user settings'
  },
  {
    label: 'Account',
    icon: <DescriptionTwoToneIcon />,
    caption: 'Show Token and other show settings'
  },
  {
    label: 'Change Password',
    icon: <VpnKeyTwoToneIcon />,
    caption: 'Change password'
  }
];

const AccountSettings = () => {
  const theme = useTheme();
  const { show } = useSelector((state) => state.show);

  const [isLoading, setIsLoading] = useState(false);
  const [showLinearProgress, setShowLinearProgress] = useState(false);
  const [gravatar, setGravatar] = useState();

  useEffect(() => {
    setIsLoading(true);
    const hashedEmail = show?.email ? md5(show?.email, { encoding: 'binary' }) : '';
    const gravatar = `//www.gravatar.com/avatar/${hashedEmail}?r=pg&d=identicon`;
    setGravatar(gravatar);
    setIsLoading(false);
  }, [show]);

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
                  <RFTab index={0} value="UserProfile">
                    {isLoading ? (
                      <UserProfileSkeleton />
                    ) : (
                      <UserProfile gravatar={gravatar} setShowLinearProgress={setShowLinearProgress} />
                    )}
                  </RFTab>
                  <RFTab index={1} value="Account">
                    <Account />
                  </RFTab>
                  <RFTab index={2} value="ChangePassword">
                    <ChangePassword />
                  </RFTab>
                </CardContent>
              </Grid>
            </Grid>
            <Divider />
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountSettings;
