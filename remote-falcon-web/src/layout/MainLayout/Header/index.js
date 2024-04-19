import { useEffect, useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { Avatar, Box, Modal, CircularProgress, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconMenu2 } from '@tabler/icons';

import Customization from 'layout/Customization';
import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';

import { ViewerControlMode } from '../../../utils/enum';
import LogoSection from '../LogoSection';
import { getAllJukeboxRequests, purgeQueue, resetVotes, deleteJukeboxRequest } from './helpers';
import LocalizationSection from './LocalizationSection';
import NotificationSection from './NotificationSection';
import ProfileSection from './ProfileSection';
import ViewJukeboxRequests from './ViewJukeboxRequests.modal';

const Header = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state) => state.menu);
  const { show } = useSelector((state) => state.show);
  const matchMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [allJukebokRequests, setAllJukeboxRequests] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  const [viewJukeboxRequestsOpen, setViewJukeboxRequestsOpen] = useState(false);
  const openViewJukeboxRequests = () => {
    setViewJukeboxRequestsOpen(true);
  };
  const closeViewJukeboxRequests = () => {
    setViewJukeboxRequestsOpen(false);
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
          loading={isFetching}
          loadingIndicator={<CircularProgress color="error" size={25} />}
          variant="contained"
          size={matchMobile ? 'small' : 'large'}
          sx={{ ml: 1, background: theme.palette.error.main, '&:hover': { background: theme.palette.error.dark } }}
          onClick={
            show?.preferences?.viewerControlMode === ViewerControlMode.JUKEBOX
              ? () => getAllJukeboxRequests(dispatch, setIsFetching, setAllJukeboxRequests, openViewJukeboxRequests, show)
              : () => resetVotes(dispatch, setIsFetching, show)
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
        onClose={() => closeViewJukeboxRequests()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ViewJukeboxRequests
          theme={theme}
          handleClose={() => closeViewJukeboxRequests()}
          jukeboxRequests={allJukebokRequests}
          deleteJukeboxRequest={(remoteJukeKey, sequence) =>
            deleteJukeboxRequest(dispatch, remoteJukeKey, sequence, setAllJukeboxRequests, setIsDeleting, show)
          }
          purgeQueue={() => purgeQueue(dispatch, setAllJukeboxRequests, setIsPurging, show)}
          isDeleting={isDeleting}
          isPurging={isPurging}
        />
      </Modal>
    </>
  );
};

export default Header;
