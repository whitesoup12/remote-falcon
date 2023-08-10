import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { Chip, Divider, Grid, List, ListItem, ListItemText, Typography, Tooltip, Stack } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';

import RFLoadingButton from 'ui-component/RFLoadingButton';

const ListItemWrapper = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  padding: 16,
  '&:hover': {
    background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
  },
  '& .MuiListItem-root': {
    padding: 0
  }
}));

const NotificationList = ({ notifications, openNotificationModal, deleteNotification, isDeleting }) => {
  const theme = useTheme();

  const chipSX = {
    height: 24,
    padding: '0 6px'
  };
  const chipWarningSX = {
    ...chipSX,
    color: theme.palette.warning.dark,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light
  };

  return (
    <List
      sx={{
        width: 330,
        maxWidth: 330,
        py: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
          maxWidth: 300
        },
        '& .MuiListItemSecondaryAction-root': {
          top: 22
        },
        '& .MuiDivider-root': {
          my: 0
        },
        '& .list-container': {
          pl: 7
        }
      }}
    >
      {_.map(notifications, (notification) => (
        <>
          <ListItemWrapper onClick={() => openNotificationModal(notification)}>
            <ListItem alignItems="center">
              <ListItemText primary={notification.notificationTitle} />
              <Tooltip placement="top" title="Delete Notification">
                <Stack direction="row" justifyContent="right">
                  <RFLoadingButton
                    loading={isDeleting}
                    onClick={(event) => deleteNotification(event, notification)}
                    color="error"
                    variant="text"
                    sx={{
                      color: theme.palette.orange.dark,
                      borderColor: theme.palette.orange.main
                    }}
                  >
                    <DeleteTwoToneIcon sx={{ fontSize: '1.5rem' }} />
                  </RFLoadingButton>
                </Stack>
              </Tooltip>
            </ListItem>
            <Grid container direction="column">
              <Grid item xs={12} sx={{ pb: 2 }}>
                <Typography variant="subtitle2">{notification.notificationPreview}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item>{!notification.notificationRead && <Chip label="Unread" sx={chipWarningSX} />}</Grid>
                </Grid>
              </Grid>
            </Grid>
          </ListItemWrapper>
          <Divider />
        </>
      ))}
    </List>
  );
};

NotificationList.propTypes = {
  notifications: PropTypes.object,
  openNotificationModal: PropTypes.func,
  deleteNotification: PropTypes.func,
  isDeleting: PropTypes.bool
};

export default NotificationList;
