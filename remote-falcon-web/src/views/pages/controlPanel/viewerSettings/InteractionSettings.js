import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import { Grid, CardActions, Divider, Typography, Switch, TextField, Autocomplete, IconButton, Tooltip, Stack } from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

const viewerPresentModes = [
  { label: 'GPS Location', id: 'gps' },
  { label: 'Code', id: 'code' }
];

const InteractionSettings = ({
  remotePrefs,
  handleSwitchChange,
  handleNumberChange,
  handleDecimalChange,
  currentLatitude,
  currentLongitude,
  handleCurrentLatitudeChange,
  handleCurrentLongitudeChange,
  psaSequences,
  defaultPsaSequences,
  handlePsaSequenceChange,
  handleViewerPresentModeChange,
  handleCheckViewerPresentChange,
  saveViewerSettings
}) => (
  <Grid item xs={12}>
    <MainCard content={false}>
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Stack direction="row" spacing={2} pb={1}>
              <Typography variant="h4">Play PSA</Typography>
              <InfoTwoToneIcon
                onClick={() =>
                  window.open('https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#play-psa', '_blank', 'noreferrer')
                }
                fontSize="small"
              />
            </Stack>
            <Typography component="div" variant="caption">
              Enables the ability to play a PSA sequence after a specified number of requests or votes.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Switch name="psaEnabled" color="primary" checked={remotePrefs?.psaEnabled} onChange={handleSwitchChange} />
          </Grid>
        </Grid>
      </CardActions>
      {remotePrefs?.psaEnabled && (
        <>
          <Divider />
          <CardActions>
            <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
              <Grid item xs={12} md={6} lg={4}>
                <Stack direction="row" spacing={2} pb={1}>
                  <Typography variant="h4">PSA Sequences</Typography>
                  <InfoTwoToneIcon
                    onClick={() =>
                      window.open(
                        'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#psa-sequences',
                        '_blank',
                        'noreferrer'
                      )
                    }
                    fontSize="small"
                  />
                </Stack>
                <Typography component="div" variant="caption">
                  These are the PSA sequences you want to be played. Multiple sequences can be selected and will be played through in the
                  order of selection.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  filterSelectedOptions
                  options={psaSequences}
                  getOptionLabel={(psaSequence) => psaSequence.title}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  defaultValue={defaultPsaSequences}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={handlePsaSequenceChange}
                />
              </Grid>
            </Grid>
          </CardActions>
          <Divider />
          <CardActions>
            <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
              <Grid item xs={12} md={6} lg={4}>
                <Stack direction="row" spacing={2} pb={1}>
                  <Typography variant="h4">PSA Frequency</Typography>
                  <InfoTwoToneIcon
                    onClick={() =>
                      window.open(
                        'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#psa-frequency',
                        '_blank',
                        'noreferrer'
                      )
                    }
                    fontSize="small"
                  />
                </Stack>
                <Typography component="div" variant="caption">
                  Controls how often a PSA is played.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  type="number"
                  fullWidth
                  label="PSA Frequency"
                  name="psaFrequency"
                  onChange={handleNumberChange}
                  value={remotePrefs?.psaFrequency}
                  onBlur={saveViewerSettings}
                />
              </Grid>
            </Grid>
          </CardActions>
        </>
      )}
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Stack direction="row" spacing={2} pb={1}>
              <Typography variant="h4">Check Viewer Present</Typography>
              <InfoTwoToneIcon
                onClick={() =>
                  window.open(
                    'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#check-viewer-present',
                    '_blank',
                    'noreferrer'
                  )
                }
                fontSize="small"
              />
            </Stack>
            <Typography component="div" variant="caption">
              Enables checks to make sure the viewer is present before placing requests or votes.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Switch
              name="checkViewerPresent"
              color="primary"
              checked={remotePrefs?.checkViewerPresent}
              onChange={handleCheckViewerPresentChange}
            />
          </Grid>
        </Grid>
      </CardActions>
      {remotePrefs?.checkViewerPresent && (
        <>
          <Divider />
          <CardActions>
            <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
              <Grid item xs={12} md={6} lg={4}>
                <Stack direction="row" spacing={2} pb={1}>
                  <Typography variant="h4">Viewer Present Mode</Typography>
                  <InfoTwoToneIcon
                    onClick={() =>
                      window.open(
                        'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#viewer-present-mode',
                        '_blank',
                        'noreferrer'
                      )
                    }
                    fontSize="small"
                  />
                </Stack>
                <Typography component="div" variant="caption">
                  The method in which you want to check that your viewer is present.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Autocomplete
                  disableClearable
                  options={viewerPresentModes}
                  value={_.find(viewerPresentModes, (prop) => prop.id === remotePrefs?.viewerPresentMode)}
                  renderInput={(params) => <TextField {...params} label="" />}
                  onChange={handleViewerPresentModeChange}
                />
              </Grid>
            </Grid>
          </CardActions>
          {remotePrefs?.enableGeolocation && (
            <>
              <Divider />
              <CardActions>
                <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <Stack direction="row" spacing={2} pb={1}>
                      <Typography variant="h4">Show Location</Typography>
                      <InfoTwoToneIcon
                        onClick={() =>
                          window.open(
                            'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#show-location',
                            '_blank',
                            'noreferrer'
                          )
                        }
                        fontSize="small"
                      />
                    </Stack>
                    <Typography component="div" variant="caption">
                      Location of the show. Defaults to detected location, but can be changed if needed.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                      <Grid item xs={11} md={5} lg={5}>
                        <TextField
                          fullWidth
                          label="Detected Latitude"
                          name="currentLatitude"
                          type="text"
                          defaultValue={currentLatitude}
                          onChange={handleCurrentLatitudeChange}
                        />
                      </Grid>
                      <Grid item xs={11} md={5} lg={5}>
                        <TextField
                          fullWidth
                          label="Detected Longitude"
                          name="currentLongitude"
                          type="text"
                          defaultValue={currentLongitude}
                          onChange={handleCurrentLongitudeChange}
                        />
                      </Grid>
                      <Grid item xs={1} md={1} lg={1}>
                        <Tooltip placement="top" title="Save Custom Location">
                          <IconButton color="primary" size="large" onClick={saveViewerSettings}>
                            <SaveTwoToneIcon sx={{ fontSize: '1.5rem' }} />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                    <Typography variant="h5" style={{ paddingTop: '1em' }}>
                      Saved Location: {remotePrefs?.remoteLatitude}, {remotePrefs?.remoteLongitude}
                    </Typography>
                  </Grid>
                </Grid>
              </CardActions>
              <Divider />
              <CardActions>
                <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <Stack direction="row" spacing={2} pb={1}>
                      <Typography variant="h4">Check Radius (in miles)</Typography>
                      <InfoTwoToneIcon
                        onClick={() =>
                          window.open(
                            'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#check-radius-in-miles',
                            '_blank',
                            'noreferrer'
                          )
                        }
                        fontSize="small"
                      />
                    </Stack>
                    <Typography component="div" variant="caption">
                      This number, in miles, determines how close the viewer should be to your location in order to place a request. Default
                      is 0.5 miles.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="Check Radius"
                      name="allowedRadius"
                      type="number"
                      step="any"
                      onChange={handleDecimalChange}
                      defaultValue={remotePrefs?.allowedRadius}
                      onBlur={saveViewerSettings}
                    />
                  </Grid>
                </Grid>
              </CardActions>
            </>
          )}
          {remotePrefs?.enableLocationCode && (
            <>
              <Divider />
              <CardActions>
                <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <Stack direction="row" spacing={2} pb={1}>
                      <Typography variant="h4">Location Code</Typography>
                      <InfoTwoToneIcon
                        onClick={() =>
                          window.open(
                            'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#location-code',
                            '_blank',
                            'noreferrer'
                          )
                        }
                        fontSize="small"
                      />
                    </Stack>
                    <Typography component="div" variant="caption">
                      This is the numerical code that will be entered by your viewer when requesting a sequence.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="Location Code"
                      name="locationCode"
                      type="number"
                      defaultValue={remotePrefs?.locationCode}
                      onBlur={saveViewerSettings}
                    />
                  </Grid>
                </Grid>
              </CardActions>
            </>
          )}
        </>
      )}
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Stack direction="row" spacing={2} pb={1}>
              <Typography variant="h4">Hide Sequence After Played</Typography>
              <InfoTwoToneIcon
                onClick={() =>
                  window.open(
                    'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#hide-sequence-after-played',
                    '_blank',
                    'noreferrer'
                  )
                }
                fontSize="small"
              />
            </Stack>
            <Typography component="div" variant="caption">
              When a requested sequence finishes, it will be hidden from the list until after this number of sequences has been played. If
              set to 0, the sequence will not be hidden after it is played.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Hide Sequence After Played"
              name="hideSequenceCount"
              type="number"
              onChange={handleNumberChange}
              defaultValue={remotePrefs?.hideSequenceCount}
              onBlur={saveViewerSettings}
            />
          </Grid>
        </Grid>
      </CardActions>
      <Divider />
    </MainCard>
  </Grid>
);

InteractionSettings.propTypes = {
  remotePrefs: PropTypes.object,
  handleSwitchChange: PropTypes.func,
  handleNumberChange: PropTypes.func,
  handleDecimalChange: PropTypes.func,
  currentLatitude: PropTypes.number,
  currentLongitude: PropTypes.number,
  handleCurrentLatitudeChange: PropTypes.func,
  handleCurrentLongitudeChange: PropTypes.func,
  psaSequences: PropTypes.array,
  defaultPsaSequences: PropTypes.array,
  handlePsaSequenceChange: PropTypes.func,
  handleViewerPresentModeChange: PropTypes.func,
  handleCheckViewerPresentChange: PropTypes.func,
  saveViewerSettings: PropTypes.func,
  refreshLocation: PropTypes.func
};

export default InteractionSettings;
