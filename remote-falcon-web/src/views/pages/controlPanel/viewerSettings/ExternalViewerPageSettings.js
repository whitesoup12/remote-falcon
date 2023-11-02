import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import { Grid, CardActions, Divider, Typography, Autocomplete, Switch, TextField, Stack } from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

const ExternalViewerPageSettings = ({
  remotePrefs,
  externalViewerPageMeta,
  handleSwitchChange,
  remoteViewerPages,
  handleViewerPageChange,
  saveExternalViewerPageMeta,
  handleExternalViewerPageMetaChange
}) => (
  <Grid item xs={12}>
    <MainCard content={false}>
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Stack direction="row" spacing={2} pb={1}>
              <Typography variant="h4">Active Viewer Page</Typography>
              <InfoTwoToneIcon
                onClick={() =>
                  window.open(
                    'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#active-viewer-page',
                    '_blank',
                    'noreferrer'
                  )
                }
                fontSize="small"
              />
            </Stack>
            <Typography component="div" variant="caption">
              Sets the current active viewer page.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Autocomplete
              disableClearable
              options={remoteViewerPages}
              value={_.find(remoteViewerPages, (prop) => prop.id === remotePrefs?.activeRemoteViewerPage)}
              renderInput={(params) => <TextField {...params} label="" />}
              onChange={handleViewerPageChange}
            />
          </Grid>
        </Grid>
      </CardActions>
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Stack direction="row" spacing={2} pb={1}>
              <Typography variant="h4">Viewer Page Title</Typography>
              <InfoTwoToneIcon
                onClick={() =>
                  window.open(
                    'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#viewer-page-title',
                    '_blank',
                    'noreferrer'
                  )
                }
                fontSize="small"
              />
            </Stack>
            <Typography component="div" variant="caption">
              Title to display in the Viewer Page browser tab/window.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Viewer Page Title"
              name="viewerPageTitle"
              defaultValue={externalViewerPageMeta?.viewerPageTitle}
              onBlur={saveExternalViewerPageMeta}
              onChange={handleExternalViewerPageMetaChange}
            />
          </Grid>
        </Grid>
      </CardActions>
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Stack direction="row" spacing={2} pb={1}>
              <Typography variant="h4">Viewer Page Icon URL</Typography>
              <InfoTwoToneIcon
                onClick={() =>
                  window.open(
                    'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#viewer-page-icon-url',
                    '_blank',
                    'noreferrer'
                  )
                }
                fontSize="small"
              />
            </Stack>
            <Typography component="div" variant="caption">
              Image URL for the icon to display in the Viewer Page browser tab/window.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Viewer Page Icon URL"
              name="viewerPageIconLink"
              defaultValue={externalViewerPageMeta?.viewerPageIconLink}
              onBlur={saveExternalViewerPageMeta}
              onChange={handleExternalViewerPageMetaChange}
            />
          </Grid>
        </Grid>
      </CardActions>
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Stack direction="row" spacing={2} pb={1}>
              <Typography variant="h4">Make it Snow</Typography>
              <InfoTwoToneIcon
                onClick={() =>
                  window.open(
                    'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#make-it-snow',
                    '_blank',
                    'noreferrer'
                  )
                }
                fontSize="small"
              />
            </Stack>
            <Typography component="div" variant="caption">
              Add a snow effect to your viewer page.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Switch name="makeItSnow" color="primary" checked={remotePrefs?.makeItSnow} onChange={handleSwitchChange} />
          </Grid>
        </Grid>
      </CardActions>
      <Divider />
    </MainCard>
  </Grid>
);

ExternalViewerPageSettings.propTypes = {
  remotePrefs: PropTypes.object,
  externalViewerPageMeta: PropTypes.object,
  handleSwitchChange: PropTypes.func,
  saveViewerSettings: PropTypes.func,
  remoteViewerPages: PropTypes.array,
  handleViewerPageChange: PropTypes.func,
  saveExternalViewerPageMeta: PropTypes.func,
  handleExternalViewerPageMetaChange: PropTypes.func
};

export default ExternalViewerPageSettings;
