import CloseIcon from '@mui/icons-material/Close';
import { CardContent, CardActions, Grid, Divider, IconButton, Typography } from '@mui/material';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';
import RFLoadingButton from 'ui-component/RFLoadingButton';

const WhatsNew = ({ handleClose }) => (
  <MainCard
    sx={{
      position: 'absolute',
      width: { xs: 450, lg: 900 },
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}
    title="What's New"
    content={false}
    secondary={
      <IconButton onClick={handleClose} size="large">
        <CloseIcon fontSize="small" />
      </IconButton>
    }
  >
    <CardContent>
      <Typography variant="h4">
        <ul>
          <li style={{ paddingBottom: '1em' }}>
            This modal is new! Sometimes people might miss messages on Facebook or Discord, so this is another way to communicate new
            features or changes.
          </li>
          <li style={{ paddingBottom: '1em' }}>
            Added an option to the Sequences page to Delete Inactive or Delete All Sequences. Fair warning, if you choose to delete
            sequences, it will remove any customizations (display name, artist, etc.).{' '}
            <a href="https://docs.remotefalcon.com/docs/control-panel/sequences#delete-sequences" target="_blank" rel="noreferrer">
              Docs link
            </a>
          </li>
        </ul>
      </Typography>
    </CardContent>
    <Divider />
    <CardActions>
      <Grid container justifyContent="flex-end">
        <RFLoadingButton onClick={handleClose} color="primary">
          Got It!
        </RFLoadingButton>
      </Grid>
    </CardActions>
  </MainCard>
);

WhatsNew.propTypes = {
  handleClose: PropTypes.func
};

export default WhatsNew;
