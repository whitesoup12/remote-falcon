import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import { Grid, CardActions, Divider, Typography, Autocomplete, Switch, TextField, Stack } from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

const viewerControlModes = [
  { label: 'Jukebox', id: 'jukebox' },
  { label: 'Voting', id: 'voting' }
];

const MainSettings = ({ remotePrefs, handleSwitchChange, handleViewerControlModeChange }) => (
  <Grid item xs={12}>
    <MainCard content={false}>
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Stack direction="row" spacing={2} pb={1}>
              <Typography variant="h4">Viewer Control</Typography>
              <InfoTwoToneIcon
                onClick={() =>
                  window.open(
                    'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#viewer-control',
                    '_blank',
                    'noreferrer'
                  )
                }
                fontSize="small"
              />
            </Stack>
            <Typography component="div" variant="caption">
              Enables the ability for the viewer to be able to control your show.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Switch name="viewerControlEnabled" color="primary" checked={remotePrefs?.viewerControlEnabled} onChange={handleSwitchChange} />
          </Grid>
        </Grid>
      </CardActions>
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Stack direction="row" spacing={2} pb={1}>
              <Typography variant="h4">Viewer Control Mode</Typography>
              <InfoTwoToneIcon
                onClick={() =>
                  window.open(
                    'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#viewer-control-mode',
                    '_blank',
                    'noreferrer'
                  )
                }
                fontSize="small"
              />
            </Stack>
            <Typography component="div" variant="caption">
              The mode in which you want your viewer to be able to control your show. Changing modes requires a plugin restart.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Autocomplete
              disableClearable
              options={viewerControlModes}
              value={_.find(viewerControlModes, (prop) => prop.id === remotePrefs?.viewerControlMode)}
              renderInput={(params) => <TextField {...params} label="" />}
              onChange={handleViewerControlModeChange}
            />
          </Grid>
        </Grid>
      </CardActions>
      <Divider />
    </MainCard>
  </Grid>
);

MainSettings.propTypes = {
  remotePrefs: PropTypes.object,
  handleSwitchChange: PropTypes.func,
  handleViewerControlModeChange: PropTypes.func
};

export default MainSettings;
