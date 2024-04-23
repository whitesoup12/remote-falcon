import { useState } from 'react';

import { useMutation } from '@apollo/client';
import LoadingButton from '@mui/lab/LoadingButton';
import { Avatar, Box, Modal, CircularProgress, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconMenu2 } from '@tabler/icons';

import Customization from 'layout/Customization';
import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';

import { ViewerControlMode } from '../../../utils/enum';
import { RESET_ALL_VOTES } from '../../../utils/graphql/controlPanel/mutations';
import { showAlert } from '../../../views/pages/globalPageHelpers';
import LogoSection from '../LogoSection';
import { resetVotes } from './helpers';
import LocalizationSection from './LocalizationSection';
import ProfileSection from './ProfileSection';
import ViewJukeboxRequests from './ViewJukeboxRequests.modal';

const Header = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state) => state.menu);
  const { show } = useSelector((state) => state.show);
  const matchMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [viewJukeboxRequestsOpen, setViewJukeboxRequestsOpen] = useState(false);
  const [isResettingVotes, setIsResettingVotes] = useState(false);

  const [resetAllVotesMutation] = useMutation(RESET_ALL_VOTES);

  const resetAllVotes = () => {
    setIsResettingVotes(true);
    resetAllVotesMutation({
      onCompleted: () => {
        setIsResettingVotes(false);
        showAlert(dispatch, { message: 'All Votes Reset' });
      },
      onError: () => {
        setIsResettingVotes(false);
        showAlert(dispatch, { alert: 'error' });
      }
    }).then();
  };

  return (
    <>
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            [theme.breakpoints.up('lg')]: {
              left: -80
            },
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            [theme.breakpoints.up('md')]: {
              mt: 2
            },
            background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
            color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
            '&:hover': {
              background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
              color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light
            }
          }}
          onClick={() => dispatch(openDrawer(!drawerOpen))}
          color="inherit"
        >
          <IconMenu2 stroke={1.5} size="50px" />
        </Avatar>
      </Box>

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      <Box>
        <LoadingButton
          loading={isResettingVotes}
          loadingIndicator={<CircularProgress color="error" size={25} />}
          variant="contained"
          size={matchMobile ? 'small' : 'large'}
          sx={{ ml: 1, background: theme.palette.error.main, '&:hover': { background: theme.palette.error.dark } }}
          onClick={
            show?.preferences?.viewerControlMode === ViewerControlMode.JUKEBOX
              ? () => setViewJukeboxRequestsOpen(true)
              : () => resetAllVotes()
          }
        >
          {show?.preferences?.viewerControlMode === ViewerControlMode.JUKEBOX ? <>View Queue</> : <>Reset Votes</>}
        </LoadingButton>
      </Box>

      {/* <Box sx={{ mr: -3 }}> */}
      {/*  <NotificationSection /> */}
      {/* </Box> */}

      <Box sx={{ mr: 1 }}>
        <LocalizationSection />
      </Box>

      <Box sx={{ ml: 2 }}>
        <Customization />
      </Box>

      <ProfileSection />

      <Modal
        open={viewJukeboxRequestsOpen}
        onClose={() => setViewJukeboxRequestsOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ViewJukeboxRequests handleClose={() => setViewJukeboxRequestsOpen(false)} />
      </Modal>
    </>
  );
};

export default Header;
