import CloseIcon from '@mui/icons-material/Close';
import { CardContent, CardActions, Divider, Grid, IconButton, Button } from '@mui/material';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import MainCard from 'ui-component/cards/MainCard';

const NotificationModal = ({ handleClose, notification }) => (
  <MainCard
    sx={{
      position: 'absolute',
      width: { xs: 280, lg: 600 },
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}
    title={notification.notificationTitle}
    content={false}
    secondary={
      <IconButton onClick={handleClose} size="large">
        <CloseIcon fontSize="small" />
      </IconButton>
    }
  >
    <CardContent>
      <ReactMarkdown linkTarget="_blank">{notification.notificationText}</ReactMarkdown>
    </CardContent>
    <Divider />
    <CardActions>
      <Grid container justifyContent="flex-end">
        <Button variant="outlined" size="large" onClick={handleClose}>
          Close
        </Button>
      </Grid>
    </CardActions>
  </MainCard>
);

NotificationModal.propTypes = {
  handleClose: PropTypes.func,
  notification: PropTypes.object
};

export default NotificationModal;
