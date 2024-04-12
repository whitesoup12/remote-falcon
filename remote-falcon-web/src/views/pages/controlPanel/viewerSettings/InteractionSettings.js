import { useCallback, useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import { Grid, CardActions, Divider, Typography, Switch, TextField, Autocomplete, IconButton, Tooltip, Stack } from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

import { savePreferencesService, savePsaSequencesService } from '../../../../services/mutations.service';
import { useDispatch, useSelector } from '../../../../store';
import { setShow } from '../../../../store/slices/show';
import { LocationCheckMethod } from '../../../../utils/enum';
import { UPDATE_PREFERENCES, UPDATE_PSA_SEQUENCES } from '../../../../utils/graphql/mutations';
import { showAlert } from '../../globalPageHelpers';

const locationCheckMethods = [
  { label: 'GPS Location', id: 'GEO' },
  { label: 'Code', id: 'CODE' }
];

const InteractionSettings = ({ setShowLinearProgress }) => {
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.show);

  const [psaOptions, setPsaOptions] = useState([]);
  const [selectedPsaOptions, setSelectedPsaOptions] = useState([]);
  const [psaSequences, setPsaSequences] = useState([]);
  const [psaFrequency, setPsaFrequency] = useState(show?.preferences?.psaFrequency);
  const [checkViewerPresent, setCheckViewerPresent] = useState(show?.preferences?.locationCheckMethod !== LocationCheckMethod.NONE);
  const [currentLatitude, setCurrentLatitude] = useState(0.0);
  const [currentLongitude, setCurrentLongitude] = useState(0.0);
  const [allowedRadius, setAllowedRadius] = useState(show?.preferences?.allowedRadius);
  const [locationCode, setLocationCode] = useState(show?.preferences?.locationCode);
  const [hideSequenceCount, setHideSequenceCount] = useState(show?.preferences?.hideSequenceCount);

  const [updatePreferencesMutation] = useMutation(UPDATE_PREFERENCES);
  const [updatePsaSequencesMutation] = useMutation(UPDATE_PSA_SEQUENCES);

  const getPsaOptions = useCallback(() => {
    const psaOptions = [];
    _.forEach(show?.sequences, (sequence) => {
      psaOptions.push({ label: sequence.displayName, id: sequence.displayName });
    });
    setPsaOptions(psaOptions);
    const existingPsaSequences = [];
    _.forEach(show?.psaSequences, (sequence) => {
      existingPsaSequences.push({ name: sequence.name, order: sequence.order });
    });
    setPsaSequences(existingPsaSequences);
  }, [show]);

  const getSelectedPsaOptions = useCallback(() => {
    const selectedPsas = [];
    _.forEach(show?.psaSequences, (psa) => selectedPsas.push({ label: psa?.name, id: psa?.name }));
    setSelectedPsaOptions(selectedPsas);
  }, [show]);

  const handlePsaEnabledSwitch = (event, value) => {
    setShowLinearProgress(true);
    const updatedPreferences = _.cloneDeep({
      ...show?.preferences,
      psaEnabled: value
    });
    savePreferencesService(updatedPreferences, updatePreferencesMutation, (response) => {
      dispatch(
        setShow({
          ...show,
          preferences: {
            ...updatedPreferences
          }
        })
      );
      showAlert(dispatch, response?.toast);
      setShowLinearProgress(false);
    });
  };

  const handleManagePsaSwitch = (event, value) => {
    setShowLinearProgress(true);
    const updatedPreferences = _.cloneDeep({
      ...show?.preferences,
      managePsa: value
    });
    savePreferencesService(updatedPreferences, updatePreferencesMutation, (response) => {
      dispatch(
        setShow({
          ...show,
          preferences: {
            ...updatedPreferences
          }
        })
      );
      showAlert(dispatch, response?.toast);
      setShowLinearProgress(false);
    });
  };

  const handleCheckViewerPresentSwitch = (event, value) => {
    const checkPresent = value;
    setCheckViewerPresent(value);
    const updatedPreferences = _.cloneDeep({
      ...show?.preferences
    });
    if (!checkPresent) {
      updatedPreferences.locationCheckMethod = LocationCheckMethod.NONE;
    } else {
      // Going to default to GEO when turning location checks on
      updatedPreferences.locationCheckMethod = LocationCheckMethod.GEO;
    }
    savePreferencesService(updatedPreferences, updatePreferencesMutation, (response) => {
      dispatch(
        setShow({
          ...show,
          preferences: {
            ...updatedPreferences
          }
        })
      );
      showAlert(dispatch, response?.toast);
    });
  };

  const handlePsaSequencesChange = (event, value) => {
    const psaSequences = [];
    const selectedPsas = [];
    value.forEach((psaSequence, index) => {
      psaSequences.push({ name: psaSequence.label, order: index });
      selectedPsas.push({ label: psaSequence?.label, id: psaSequence?.label });
    });
    setSelectedPsaOptions(selectedPsas);
    setPsaSequences(psaSequences);
  };

  const handleLocationCheckMethodChange = (event, value) => {
    setShowLinearProgress(true);
    const updatedPreferences = _.cloneDeep({
      ...show?.preferences,
      locationCheckMethod: value.id
    });
    savePreferencesService(updatedPreferences, updatePreferencesMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            preferences: {
              ...updatedPreferences
            }
          })
        );
      }
      showAlert(dispatch, response?.toast);
      setShowLinearProgress(false);
    });
  };

  const refreshLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLatitude(position.coords.latitude.toFixed(5));
        setCurrentLongitude(position.coords.longitude.toFixed(5));
      });
    } else {
      showAlert(dispatch, { alert: 'wanting', message: 'Location is not enabled' });
    }
  }, [dispatch]);

  const getSelectedLocationCheckMethod = () => {
    let selectedLocationCheckMethod = {};
    _.forEach(locationCheckMethods, (checkMethod) => {
      if (checkMethod.id === show?.preferences?.locationCheckMethod) {
        selectedLocationCheckMethod = checkMethod;
      }
    });
    return selectedLocationCheckMethod;
  };

  const saveCustomLocation = () => {
    setShowLinearProgress(true);
    const updatedPreferences = _.cloneDeep({
      ...show?.preferences,
      showLatitude: parseFloat(currentLatitude),
      showLongitude: parseFloat(currentLongitude)
    });
    savePreferencesService(updatedPreferences, updatePreferencesMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            preferences: {
              ...updatedPreferences
            }
          })
        );
      }
      showAlert(dispatch, response?.toast);
      setShowLinearProgress(false);
    });
  };

  const savePsaSequences = () => {
    setShowLinearProgress(true);
    savePsaSequencesService(psaSequences, updatePsaSequencesMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            psaSequences: {
              ...psaSequences
            }
          })
        );
      }
      showAlert(dispatch, response?.toast);
      setShowLinearProgress(false);
    });
  };

  const savePreferences = () => {
    setShowLinearProgress(true);
    const updatedPreferences = _.cloneDeep({
      ...show?.preferences,
      psaFrequency,
      allowedRadius,
      locationCode,
      hideSequenceCount
    });
    savePreferencesService(updatedPreferences, updatePreferencesMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            preferences: {
              ...updatedPreferences
            }
          })
        );
      }
      showAlert(dispatch, response?.toast);
      setShowLinearProgress(false);
    });
  };

  useEffect(() => {
    getPsaOptions();
    getSelectedPsaOptions();
    refreshLocation();
  }, [getPsaOptions, getSelectedPsaOptions, refreshLocation]);

  return (
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
              <Switch name="psaEnabled" color="primary" checked={show?.preferences?.psaEnabled} onChange={handlePsaEnabledSwitch} />
            </Grid>
          </Grid>
        </CardActions>
        {show?.preferences?.psaEnabled && (
          <>
            <Divider />
            <CardActions>
              <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                <Grid item xs={12} md={6} lg={4} ml={2}>
                  <Stack direction="row" spacing={2} pb={1}>
                    <Typography variant="h4">Managed PSA</Typography>
                    <InfoTwoToneIcon
                      onClick={() =>
                        window.open(
                          'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#managed-psa',
                          '_blank',
                          'noreferrer'
                        )
                      }
                      fontSize="small"
                    />
                  </Stack>
                  <Typography component="div" variant="caption">
                    Gives Remote Falcon the ability to fully manage your PSA and control when it plays, even if requests or votes are not
                    being made.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <Switch name="managePsa" color="primary" checked={show?.preferences?.managePsa} onChange={handleManagePsaSwitch} />
                </Grid>
              </Grid>
            </CardActions>
            <Divider />
            <CardActions>
              <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                <Grid item xs={12} md={6} lg={4} ml={2}>
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
                    options={psaOptions}
                    getOptionLabel={(psaSequence) => psaSequence.label}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={selectedPsaOptions}
                    renderInput={(params) => <TextField {...params} />}
                    onChange={handlePsaSequencesChange}
                    onBlur={savePsaSequences}
                  />
                </Grid>
              </Grid>
            </CardActions>
            <Divider />
            <CardActions>
              <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                <Grid item xs={12} md={6} lg={4} ml={2}>
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
                    value={psaFrequency}
                    onChange={(e) => setPsaFrequency(parseInt(e?.target?.value, 10))}
                    onBlur={savePreferences}
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
              <Switch color="primary" checked={checkViewerPresent} onChange={handleCheckViewerPresentSwitch} />
            </Grid>
          </Grid>
        </CardActions>
        {checkViewerPresent && (
          <>
            <Divider />
            <CardActions>
              <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                <Grid item xs={12} md={6} lg={4} ml={2}>
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
                    options={locationCheckMethods}
                    value={getSelectedLocationCheckMethod()}
                    renderInput={(params) => <TextField {...params} label="" />}
                    onChange={handleLocationCheckMethodChange}
                  />
                </Grid>
              </Grid>
            </CardActions>
            {show?.preferences?.locationCheckMethod === LocationCheckMethod.GEO && (
              <>
                <Divider />
                <CardActions>
                  <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                    <Grid item xs={12} md={6} lg={4} ml={4}>
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
                        {currentLatitude === 0 && currentLongitude === 0 && (
                          <Typography component="div" color="#f44336">
                            Location could not be detected! Please ensure location permissions are allowed.
                          </Typography>
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                        <Grid item xs={11} md={5} lg={5}>
                          <TextField
                            fullWidth
                            label="Detected Latitude"
                            type="text"
                            value={currentLatitude}
                            onChange={(e) => setCurrentLatitude(e?.target?.value)}
                          />
                        </Grid>
                        <Grid item xs={11} md={5} lg={5}>
                          <TextField
                            fullWidth
                            label="Detected Longitude"
                            type="text"
                            value={currentLongitude}
                            onChange={(e) => setCurrentLongitude(e?.target?.value)}
                          />
                        </Grid>
                        <Grid item xs={1} md={1} lg={1}>
                          <Tooltip placement="top" title="Save Custom Location">
                            <IconButton color="primary" size="large" onClick={saveCustomLocation}>
                              <SaveTwoToneIcon sx={{ fontSize: '1.5rem' }} />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                      <Typography variant="h5" style={{ paddingTop: '1em' }}>
                        Saved Location: {show?.preferences?.showLatitude}, {show?.preferences?.showLongitude}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardActions>
                <Divider />
                <CardActions>
                  <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                    <Grid item xs={12} md={6} lg={4} ml={4}>
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
                        This number, in miles, determines how close the viewer should be to your location in order to place a request.
                        Default is 0.5 miles.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        fullWidth
                        label="Check Radius"
                        type="number"
                        step="any"
                        value={allowedRadius}
                        onChange={(e) => setAllowedRadius(parseFloat(e?.target?.value))}
                        onBlur={savePreferences}
                      />
                    </Grid>
                  </Grid>
                </CardActions>
              </>
            )}
            {show?.preferences?.locationCheckMethod === LocationCheckMethod.CODE && (
              <>
                <Divider />
                <CardActions>
                  <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                    <Grid item xs={12} md={6} lg={4} ml={4}>
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
                        type="number"
                        value={locationCode}
                        onChange={(e) => setLocationCode(parseInt(e?.target?.value, 10))}
                        onBlur={savePreferences}
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
                type="number"
                value={hideSequenceCount}
                onChange={(e) => setHideSequenceCount(parseInt(e?.target?.value, 10))}
                onBlur={savePreferences}
              />
            </Grid>
          </Grid>
        </CardActions>
        <Divider />
      </MainCard>
    </Grid>
  );
};

InteractionSettings.propTypes = {
  setShowLinearProgress: PropTypes.func
};

export default InteractionSettings;
