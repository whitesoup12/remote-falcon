import { useState, useEffect, useCallback } from 'react';

import { Box, Grid, CardContent, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { sequencesService } from 'services/controlPanel/sequences.services';
import { remotePrefsService, getExternalViewerPageMetaService } from 'services/controlPanel/viewerSettings.service';
import { useDispatch, useSelector } from 'store';
import { gridSpacing } from 'store/constant';
import { setCoreInfo } from 'store/slices/account';
import { setRemotePrefs, setExternalViewerPageMeta } from 'store/slices/controlPanel';
import MainCard from 'ui-component/cards/MainCard';
import ViewerSettingsSkeleton from 'ui-component/cards/Skeleton/ViewerSettingsSkeleton';
import { RFTabPanel, RFTab } from 'ui-component/RFTabPanel';
import { showAlert, mixpanelTrack } from 'views/pages/globalPageHelpers';

import ExternalViewerPageSettings from './ExternalViewerPageSettings';
import {
  saveViewerSettings,
  saveExternalViewerPageMeta,
  getSequencesForPSA,
  tabOptions,
  getRemoteViewerPages,
  getDefaultSequencesForPSA,
  refreshLocation,
  handleSwitchChange,
  handleViewerControlModeChange,
  handleViewerPageChange,
  handleExternalViewerPageMetaChange,
  handleNumberChange,
  handleDecimalChange,
  handleCurrentLatitudeChange,
  handleCurrentLongitudeChange,
  handlePsaSequenceChange,
  handleViewerPresentModeChange,
  handleCheckViewerPresentChange
} from './helpers';
import InteractionSettings from './InteractionSettings';
import JukeboxSettings from './JukeboxSettings';
import MainSettings from './MainSettings';
import VotingSettings from './VotingSettings';

const ViewerSettings = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { remotePrefs, externalViewerPageMeta } = useSelector((state) => state.controlPanel);
  const { coreInfo } = useSelector((state) => state.account);

  const [showSkeletonLoader, setShowSkeletonLoader] = useState(false);
  const [showLinearProgress, setShowLinearProgress] = useState(false);
  const [psaSequences, setPsaSequences] = useState([]);
  const [remoteViewerPages, setRemoteViewerPages] = useState([]);
  const [defaultPsaSequences, setDefaultPsaSequences] = useState([]);
  const [currentLatitude, setCurrentLatitude] = useState(0.0);
  const [currentLongitude, setCurrentLongitude] = useState(0.0);

  const fetchSequences = useCallback(async () => {
    try {
      const sequencesResponse = await sequencesService();
      const sequences = sequencesResponse.data;
      getSequencesForPSA(sequences, setPsaSequences);
    } catch (err) {
      showAlert({ dispatch, alert: 'error' });
    }
  }, [dispatch]);

  const fetchRemotePrefs = useCallback(async () => {
    try {
      const remotePrefsResponse = await remotePrefsService();
      const remotePrefs = remotePrefsResponse.data;
      remotePrefs.checkViewerPresent = remotePrefs?.enableGeolocation || remotePrefs?.enableLocationCode;
      remotePrefs.viewerPresentMode = remotePrefs?.enableLocationCode ? 'code' : 'gps';
      getRemoteViewerPages(remotePrefs, setRemoteViewerPages);
      getDefaultSequencesForPSA(remotePrefs, setDefaultPsaSequences);
      refreshLocation(setCurrentLatitude, setCurrentLongitude);
      dispatch(
        setRemotePrefs({
          ...remotePrefs
        })
      );
    } catch (err) {
      showAlert({ dispatch, alert: 'error' });
    }
  }, [dispatch]);

  const fetchExternalViewerPageMeta = useCallback(async () => {
    try {
      const externalViewerPageMetaResponse = await getExternalViewerPageMetaService();
      dispatch(
        setExternalViewerPageMeta({
          ...externalViewerPageMetaResponse.data
        })
      );
    } catch (err) {
      showAlert({ dispatch, alert: 'error' });
    }
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      setShowSkeletonLoader(true);
      mixpanelTrack('Remote Falcon Settings Page View', coreInfo);
      await fetchSequences();
      await fetchRemotePrefs();
      await fetchExternalViewerPageMeta();
      setShowSkeletonLoader(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSequences, fetchRemotePrefs, fetchExternalViewerPageMeta]);

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard title="Remote Falcon Settings" content={false}>
            {showSkeletonLoader ? (
              <ViewerSettingsSkeleton tabOptions={tabOptions} />
            ) : (
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  {showLinearProgress && <LinearProgress />}
                </Grid>
                <Grid item xs={12} lg={4}>
                  <CardContent>
                    <RFTabPanel tabOptions={tabOptions} orientation="vertical" />
                  </CardContent>
                </Grid>
                <Grid item xs={12} lg={8}>
                  <CardContent
                    sx={{
                      borderLeft: '1px solid',
                      borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[200],
                      height: '100%'
                    }}
                  >
                    <RFTab index={0}>
                      <MainSettings
                        remotePrefs={remotePrefs}
                        handleSwitchChange={(event, value) =>
                          handleSwitchChange(
                            event,
                            value,
                            dispatch,
                            coreInfo,
                            remotePrefs,
                            currentLatitude,
                            currentLongitude,
                            setShowLinearProgress,
                            setRemotePrefs,
                            setCoreInfo
                          )
                        }
                        handleViewerControlModeChange={(event, value) =>
                          handleViewerControlModeChange(
                            event,
                            value,
                            dispatch,
                            coreInfo,
                            remotePrefs,
                            currentLatitude,
                            currentLongitude,
                            setShowLinearProgress,
                            setRemotePrefs,
                            setCoreInfo
                          )
                        }
                        remoteViewerPages={remoteViewerPages}
                        handleViewerPageChange={(event, value) =>
                          handleViewerPageChange(
                            event,
                            value,
                            dispatch,
                            coreInfo,
                            remotePrefs,
                            currentLatitude,
                            currentLongitude,
                            setShowLinearProgress,
                            setRemotePrefs,
                            setCoreInfo
                          )
                        }
                      />
                    </RFTab>
                    <RFTab index={1}>
                      <ExternalViewerPageSettings
                        remotePrefs={remotePrefs}
                        externalViewerPageMeta={externalViewerPageMeta}
                        handleSwitchChange={(event, value) =>
                          handleSwitchChange(
                            event,
                            value,
                            dispatch,
                            coreInfo,
                            remotePrefs,
                            currentLatitude,
                            currentLongitude,
                            setShowLinearProgress,
                            setRemotePrefs,
                            setCoreInfo
                          )
                        }
                        remoteViewerPages={remoteViewerPages}
                        handleViewerPageChange={(event, value) =>
                          handleViewerPageChange(
                            event,
                            value,
                            dispatch,
                            coreInfo,
                            remotePrefs,
                            currentLatitude,
                            currentLongitude,
                            setShowLinearProgress,
                            setRemotePrefs,
                            setCoreInfo
                          )
                        }
                        saveExternalViewerPageMeta={() =>
                          saveExternalViewerPageMeta(dispatch, externalViewerPageMeta, setShowLinearProgress, setExternalViewerPageMeta)
                        }
                        handleExternalViewerPageMetaChange={(event, value) =>
                          handleExternalViewerPageMetaChange(event, value, dispatch, externalViewerPageMeta)
                        }
                      />
                    </RFTab>
                    <RFTab index={2}>
                      <JukeboxSettings
                        remotePrefs={remotePrefs}
                        handleNumberChange={(event, value) => handleNumberChange(event, value, dispatch, remotePrefs)}
                        saveViewerSettings={() =>
                          saveViewerSettings(
                            dispatch,
                            coreInfo,
                            remotePrefs,
                            currentLatitude,
                            currentLongitude,
                            setShowLinearProgress,
                            setRemotePrefs,
                            setCoreInfo
                          )
                        }
                      />
                    </RFTab>
                    <RFTab index={3}>
                      <VotingSettings
                        remotePrefs={remotePrefs}
                        handleSwitchChange={(event, value) =>
                          handleSwitchChange(
                            event,
                            value,
                            dispatch,
                            coreInfo,
                            remotePrefs,
                            currentLatitude,
                            currentLongitude,
                            setShowLinearProgress,
                            setRemotePrefs,
                            setCoreInfo
                          )
                        }
                      />
                    </RFTab>
                    <RFTab index={4}>
                      <InteractionSettings
                        remotePrefs={remotePrefs}
                        handleSwitchChange={(event, value) =>
                          handleSwitchChange(
                            event,
                            value,
                            dispatch,
                            coreInfo,
                            remotePrefs,
                            currentLatitude,
                            currentLongitude,
                            setShowLinearProgress,
                            setRemotePrefs,
                            setCoreInfo
                          )
                        }
                        handleNumberChange={(event, value) => handleNumberChange(event, value, dispatch, remotePrefs)}
                        handleDecimalChange={(event, value) => handleDecimalChange(event, value, dispatch, remotePrefs)}
                        currentLatitude={currentLatitude}
                        currentLongitude={currentLongitude}
                        handleCurrentLatitudeChange={(event, value) => handleCurrentLatitudeChange(event, value, setCurrentLatitude)}
                        handleCurrentLongitudeChange={(event, value) => handleCurrentLongitudeChange(event, value, setCurrentLongitude)}
                        psaSequences={psaSequences}
                        defaultPsaSequences={defaultPsaSequences}
                        handlePsaSequenceChange={(event, value) =>
                          handlePsaSequenceChange(
                            event,
                            value,
                            dispatch,
                            coreInfo,
                            remotePrefs,
                            currentLatitude,
                            currentLongitude,
                            setShowLinearProgress,
                            setRemotePrefs,
                            setCoreInfo
                          )
                        }
                        handleViewerPresentModeChange={(event, value) =>
                          handleViewerPresentModeChange(
                            event,
                            value,
                            dispatch,
                            coreInfo,
                            remotePrefs,
                            currentLatitude,
                            currentLongitude,
                            setShowLinearProgress,
                            setRemotePrefs,
                            setCoreInfo
                          )
                        }
                        handleCheckViewerPresentChange={(event, value) =>
                          handleCheckViewerPresentChange(
                            event,
                            value,
                            dispatch,
                            coreInfo,
                            remotePrefs,
                            currentLatitude,
                            currentLongitude,
                            setShowLinearProgress,
                            setRemotePrefs,
                            setCoreInfo
                          )
                        }
                        saveViewerSettings={() =>
                          saveViewerSettings(
                            dispatch,
                            coreInfo,
                            remotePrefs,
                            currentLatitude,
                            currentLongitude,
                            setShowLinearProgress,
                            setRemotePrefs,
                            setCoreInfo
                          )
                        }
                        refreshLocation={() => refreshLocation(setCurrentLatitude, setCurrentLongitude, dispatch)}
                      />
                    </RFTab>
                  </CardContent>
                </Grid>
              </Grid>
            )}
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewerSettings;
