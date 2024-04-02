import { useEffect, useRef, useState } from 'react';

import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconLogout, IconSettings, IconBook, IconBug } from '@tabler/icons';
import md5 from 'md5';
import { useNavigate } from 'react-router-dom';

import useAuth from 'hooks/useAuth';
import useConfig from 'hooks/useConfig';
import { useSelector } from 'store';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

const ProfileSection = () => {
  const theme = useTheme();
  const { borderRadius } = useConfig();
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { logout } = useAuth();
  const { coreInfo } = useSelector((state) => state.account);
  const [open, setOpen] = useState(false);
  const [gravatar, setGravatar] = useState();
  const [showNameUrl, setShowNameUrl] = useState();

  const anchorRef = useRef(null);
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    let showUrl = `https://${coreInfo?.showSubdomain}.remotefalcon.com`;
    if (process?.env?.REACT_APP_HOST_ENV === 'local') {
      showUrl = `http://${coreInfo?.showSubdomain}.localhost:3000`;
    } else if (process?.env?.REACT_APP_HOST_ENV === 'development') {
      showUrl = `https://${coreInfo?.showSubdomain}.remotefalcon.dev`;
    }
    setShowNameUrl(showUrl);

    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    const hashedEmail = coreInfo?.email ? md5(coreInfo?.email, { encoding: 'binary' }) : '';
    const gravatar = `//www.gravatar.com/avatar/${hashedEmail}?r=pg&d=identicon`;
    setGravatar(gravatar);

    prevOpen.current = open;
  }, [open, coreInfo]);

  const handleShowNameClick = () => {
    window.open(showNameUrl, '_blank', 'noreferrer');
  };

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={gravatar}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="24px" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />

      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{ p: 2, pb: 2 }}>
                      <Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography
                            component="span"
                            variant="h2"
                            color={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}
                            sx={{ fontWeight: 400, cursor: 'pointer', justifyContent: 'center' }}
                            onClick={() => handleShowNameClick()}
                          >
                            {coreInfo?.showName}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ pt: 1 }}>
                          <Typography
                            component="span"
                            variant="h5"
                            color={theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark}
                          >
                            {showNameUrl}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2, pt: 0 }}>
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        <ListItemButton
                          sx={{ borderRadius: `${borderRadius}px` }}
                          selected={selectedIndex === 0}
                          onClick={(event) => handleListItemClick(event, 0, '/control-panel/account-settings')}
                        >
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Account Settings</Typography>} />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ borderRadius: `${borderRadius}px` }}
                          selected={selectedIndex === 1}
                          onClick={(event) => handleListItemClick(event, 0, '/control-panel/remote-falcon-tracker')}
                        >
                          <ListItemIcon>
                            <IconBug stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Work Item Tracker</Typography>} />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ borderRadius: `${borderRadius}px` }}
                          selected={selectedIndex === 2}
                          onClick={() => window.open('https://docs.remotefalcon.com', '_blank', 'noreferrer')}
                        >
                          <ListItemIcon>
                            <IconBook stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Docs</Typography>} />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 3} onClick={handleLogout}>
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
