import React, { useMemo, useState } from 'react';

import { AppBar, Box, Container, CssBaseline, Modal, Toolbar, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IconChevronRight } from '@tabler/icons';
import { Outlet } from 'react-router-dom';

import useConfig from 'hooks/useConfig';
import navigation from 'menu-items';
import { useDispatch, useSelector } from 'store';
import { drawerWidth } from 'store/constant';
import { openDrawer } from 'store/slices/menu';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

import Header from './Header';
import Sidebar from './Sidebar';
import WhatsNew from './WhatsNew.modal';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  ...(!open && {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter
    }),
    [theme.breakpoints.up('md')]: {
      marginLeft: -(drawerWidth - 20),
      width: `calc(100% - ${drawerWidth}px)`
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px',
      width: `calc(100% - ${drawerWidth}px)`,
      padding: '16px'
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10px',
      width: `calc(100% - ${drawerWidth}px)`,
      padding: '16px',
      marginRight: '10px'
    }
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.shorter
    }),
    marginLeft: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: `calc(100% - ${drawerWidth}px)`,
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px'
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10px'
    }
  })
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));

  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state) => state.menu);
  const { container } = useConfig();

  const [whatsNewOpen, setWhatsNewOpen] = useState(false);

  const newStuffDateString = '2023-11-21';
  const newStuffDate = Date.parse(newStuffDateString);

  React.useEffect(() => {
    dispatch(openDrawer(!matchDownMd));
    const whatsNewDateViewed = window.localStorage.getItem('whatsNew');
    if (!whatsNewDateViewed || newStuffDate > Date.parse(whatsNewDateViewed)) {
      setWhatsNewOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownMd]);

  const header = useMemo(
    () => (
      <Toolbar>
        <Header />
      </Toolbar>
    ),
    []
  );

  const closeWhatsNew = () => {
    window.localStorage.setItem('whatsNew', newStuffDateString);
    setWhatsNewOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: drawerOpen ? theme.transitions.create('width') : 'none'
        }}
      >
        {header}
      </AppBar>

      {/* drawer */}
      <Sidebar />

      {/* main content */}
      <Main theme={theme} open={drawerOpen}>
        <Modal open={whatsNewOpen} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
          <WhatsNew handleClose={() => closeWhatsNew()} />
        </Modal>
        {/* breadcrumb */}
        {container && (
          <Container maxWidth="lg">
            <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
            <Outlet />
          </Container>
        )}
        {!container && (
          <>
            <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
            <Outlet />
          </>
        )}
      </Main>
    </Box>
  );
};

export default MainLayout;
