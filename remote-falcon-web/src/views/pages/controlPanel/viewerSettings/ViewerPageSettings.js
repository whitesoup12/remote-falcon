import { useCallback, useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import { Grid, CardActions, Divider, Typography, Autocomplete, Switch, TextField, Stack } from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

import { savePagesService, savePreferencesService } from '../../../../services/mutations.service';
import { useDispatch, useSelector } from '../../../../store';
import { setShow } from '../../../../store/slices/show';
import { UPDATE_PAGES, UPDATE_PREFERENCES } from '../../../../utils/graphql/mutations';
import { showAlert } from '../../globalPageHelpers';

const ViewerPageSettings = ({ setShowLinearProgress }) => {
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.show);

  const [viewerPageOptions, setViewerPageOptions] = useState([]);
  const [pageTitle, setPageTitle] = useState(show?.preferences?.pageTitle);
  const [pageIconUrl, setPageIconUrl] = useState(show?.preferences?.pageIconUrl);

  const [updatePagesMutation] = useMutation(UPDATE_PAGES);
  const [updatePreferencesMutation] = useMutation(UPDATE_PREFERENCES);

  const getViewerPageOptions = useCallback(() => {
    const viewerPageOptions = [];
    _.forEach(show?.pages, (page) => {
      viewerPageOptions.push({ label: page.name, id: page.name, active: page.active });
    });
    setViewerPageOptions(viewerPageOptions);
  }, [show]);

  const handleViewerPageChange = (event, value) => {
    setShowLinearProgress(true);
    const updatedPages = _.cloneDeep([...show?.pages]);
    _.forEach(updatedPages, (page) => {
      page.active = page?.name === value?.id;
    });
    savePagesService(updatedPages, updatePagesMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            pages: [...updatedPages]
          })
        );
        showAlert(dispatch, response?.toast);
        setShowLinearProgress(false);
      } else {
        showAlert(dispatch, response?.toast);
        setShowLinearProgress(false);
      }
    });
  };

  const getSelectedViewerPage = () => {
    let selectedViewerPage = {};
    _.forEach(viewerPageOptions, (option) => {
      if (option.active) {
        selectedViewerPage = option;
      }
    });
    return selectedViewerPage;
  };

  const savePreferences = () => {
    setShowLinearProgress(true);
    const updatedPreferences = _.cloneDeep({
      ...show?.preferences,
      pageTitle,
      pageIconUrl
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

  const handleMakeItSnowSwitch = (event, value) => {
    setShowLinearProgress(true);
    const updatedPreferences = _.cloneDeep({
      ...show?.preferences,
      makeItSnow: value
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
    getViewerPageOptions();
  }, [getViewerPageOptions]);

  return (
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
                options={viewerPageOptions}
                value={getSelectedViewerPage()}
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
                value={pageTitle}
                onChange={(e) => setPageTitle(e?.target?.value)}
                onBlur={savePreferences}
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
                value={pageIconUrl}
                onChange={(e) => setPageIconUrl(e?.target?.value)}
                onBlur={savePreferences}
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
              <Switch color="primary" checked={show?.preferences?.makeItSnow} onChange={handleMakeItSnowSwitch} />
            </Grid>
          </Grid>
        </CardActions>
        <Divider />
      </MainCard>
    </Grid>
  );
};

ViewerPageSettings.propTypes = {
  setShowLinearProgress: PropTypes.func
};

export default ViewerPageSettings;
