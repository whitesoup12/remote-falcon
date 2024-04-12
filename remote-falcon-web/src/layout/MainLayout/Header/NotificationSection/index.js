import { useEffect, useRef, useState, useCallback } from 'react';

import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  Typography,
  Badge,
  useMediaQuery,
  Modal
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconBell } from '@tabler/icons';
import _ from 'lodash';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link } from 'react-router-dom';

import useInterval from 'hooks/useInterval';
import {
  getNotificationsService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
  deleteNotificationService
} from 'services/controlPanel/headerFunctions.service';
import { useSelector } from 'store';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

import NotificationModal from './Notification.modal';
import NotificationList from './NotificationList';

const NotificationSection = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const { show } = useSelector((state) => state.show);

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notificationsUnreadCount, setNotificationsUnreadCount] = useState(0);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (notificationModalOpen || (anchorRef.current && anchorRef.current.contains(event.target))) {
      return;
    }
    setOpen(false);
  };

  const fetchNotifications = useCallback(async () => {
    const notificationsResponse = await getNotificationsService();
    const notificationsData = notificationsResponse?.data;
    setNotificationsCount(notificationsData.length);
    let notificationsCount = 0;
    _.forEach(notificationsData, (notification) => {
      if (!notification.notificationRead) {
        notificationsCount += 1;
      }
    });
    setNotifications(notificationsData);
    setNotificationsUnreadCount(notificationsCount);
  }, []);

  const closeNotificationModal = () => {
    setTimeout(() => {
      setNotificationModalOpen(false);
      fetchNotifications();
    }, 50);
  };

  const openNotificationModal = async (notification) => {
    setSelectedNotification(notification);
    setNotificationModalOpen(true);
    if (!notification.notificationRead) {
      await markNotificationAsReadService(notification.notificationKey);
    }
    fetchNotifications();
  };

  const markAllNotificationsAsRead = async () => {
    await markAllNotificationsAsReadService();
    setOpen(false);
    fetchNotifications();
  };

  const deleteNotification = async (event, notification) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDeleting(true);
    await deleteNotificationService(notification.notificationKey);
    await fetchNotifications();
    setIsDeleting(false);
    setNotificationModalOpen(false);
  };

  useInterval(async () => {
    fetchNotifications();
  }, 30000);

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;

    fetchNotifications();
  }, [open, fetchNotifications]);

  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          }
        }}
      >
        <Badge badgeContent={notificationsUnreadCount} color="primary">
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
              color: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.secondary.dark,
              '&[aria-controls="menu-list-grow"],&:hover': {
                background: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.secondary.dark,
                color: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.secondary.light
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            <IconBell stroke={1.5} size="20px" />
          </Avatar>
        </Badge>
      </Box>

      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
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
                offset: [matchesXs ? 5 : 0, 20]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                          <Grid item>
                            <Stack direction="row" spacing={2}>
                              <Typography variant="subtitle1">Notifications</Typography>
                              <Chip
                                size="small"
                                label={notificationsCount}
                                sx={{
                                  color: theme.palette.background.default,
                                  bgcolor: notificationsUnreadCount > 0 ? theme.palette.warning.dark : theme.palette.primary.dark
                                }}
                              />
                            </Stack>
                          </Grid>
                          {notificationsCount > 0 && (
                            <Grid item>
                              <Typography
                                onClick={() => markAllNotificationsAsRead()}
                                component={Link}
                                to="#"
                                variant="subtitle2"
                                color="primary"
                                sx={{ ml: 2 }}
                              >
                                Mark as all read
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <PerfectScrollbar
                          options={{ wheelPropagation: false }}
                          style={{
                            height: '100%',
                            maxHeight: 'calc(100vh - 205px)',
                            overflow: 'auto'
                          }}
                        >
                          <Grid container direction="column" spacing={2}>
                            <Grid item xs={12} p={0}>
                              <Divider sx={{ my: 0 }} />
                            </Grid>
                          </Grid>
                          <NotificationList
                            notifications={notifications}
                            openNotificationModal={openNotificationModal}
                            deleteNotification={deleteNotification}
                            isDeleting={isDeleting}
                          />
                        </PerfectScrollbar>
                      </Grid>
                    </Grid>
                    <Divider />
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>

      <Modal
        open={notificationModalOpen}
        onClose={() => closeNotificationModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <NotificationModal handleClose={() => closeNotificationModal()} notification={selectedNotification} />
      </Modal>
    </>
  );
};

export default NotificationSection;
