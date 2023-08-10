import { useEffect, useState, useCallback } from 'react';

import { Box, Grid } from '@mui/material';

import useAuth from 'hooks/useAuth';
import { remotePrefsService } from 'services/controlPanel/viewerSettings.service';
import { useDispatch, useSelector } from 'store';
import { unexpectedErrorMessage, gridSpacing } from 'store/constant';
import { setRemotePrefs } from 'store/slices/controlPanel';
import { openSnackbar } from 'store/slices/snackbar';
import { mixpanelTrack } from 'views/pages/globalPageHelpers';

import DashboardCharts from './DashboardCharts';
import DashboardHeader from './DashboardHeader';

const Dashboard = () => {
  const { coreInfo } = useAuth();
  const { remotePrefs } = useSelector((state) => state.controlPanel);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const fetchRemotePrefs = useCallback(async () => {
    try {
      const remotePrefsResponse = await remotePrefsService();
      const remotePrefs = remotePrefsResponse.data;
      dispatch(
        setRemotePrefs({
          ...remotePrefs
        })
      );
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: unexpectedErrorMessage,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      mixpanelTrack('Dashboard Page View', coreInfo);
      await fetchRemotePrefs();
      setIsLoading(false);
    };

    init();
  }, [dispatch, fetchRemotePrefs, coreInfo]);

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={gridSpacing}>
        <DashboardHeader isLoading={isLoading} timezone={coreInfo?.timezone} viewerControlMode={remotePrefs?.viewerControlMode} />
        <DashboardCharts
          isLoading={isLoading}
          timezone={coreInfo?.timezone}
          viewerControlMode={remotePrefs?.viewerControlMode}
          coreInfo={coreInfo}
        />
      </Grid>
    </Box>
  );
};

export default Dashboard;
