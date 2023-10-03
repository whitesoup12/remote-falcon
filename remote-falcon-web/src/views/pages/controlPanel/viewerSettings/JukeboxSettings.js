import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import { Grid, CardActions, Divider, Typography, TextField, Stack } from '@mui/material';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

const JukeboxSettings = ({ remotePrefs, handleNumberChange, saveViewerSettings }) => (
  <Grid item xs={12}>
    <MainCard content={false}>
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Stack direction="row" spacing={2} pb={1}>
              <Typography variant="h4">Jukebox Queue Depth</Typography>
              <InfoTwoToneIcon
                onClick={() =>
                  window.open(
                    'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#jukebox-queue-depth',
                    '_blank',
                    'noreferrer'
                  )
                }
                fontSize="small"
              />
            </Stack>
            <Typography component="div" variant="caption">
              Controls how many sequences can be in the Jukebox Queue (use 0 for unlimited queue depth).
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              type="number"
              fullWidth
              label="Jukebox Queue Depth"
              name="jukeboxDepth"
              onChange={handleNumberChange}
              value={remotePrefs?.jukeboxDepth}
              onBlur={saveViewerSettings}
            />
          </Grid>
        </Grid>
      </CardActions>
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Stack direction="row" spacing={2} pb={1}>
              <Typography variant="h4">Jukebox Sequence Request Limit</Typography>
              <InfoTwoToneIcon
                onClick={() =>
                  window.open(
                    'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#jukebox-sequence-request-limit',
                    '_blank',
                    'noreferrer'
                  )
                }
                fontSize="small"
              />
            </Stack>
            <Typography component="div" variant="caption">
              Controls when a sequence can be requested if it already exists in the queue. Use 0 to allow any sequence to be requested at
              any time.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              type="number"
              fullWidth
              label="Jukebox Sequence Request Limit"
              name="jukeboxRequestLimit"
              onChange={handleNumberChange}
              value={remotePrefs?.jukeboxRequestLimit}
              onBlur={saveViewerSettings}
            />
          </Grid>
        </Grid>
      </CardActions>
      <Divider />
    </MainCard>
  </Grid>
);

JukeboxSettings.propTypes = {
  remotePrefs: PropTypes.object,
  handleNumberChange: PropTypes.func,
  saveViewerSettings: PropTypes.func
};

export default JukeboxSettings;
