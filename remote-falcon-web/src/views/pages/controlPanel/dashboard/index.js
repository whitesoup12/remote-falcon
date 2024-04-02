import { useEffect, useState, useCallback } from 'react';

import { Box, Grid } from '@mui/material';

import useAuth from 'hooks/useAuth';
import { useDispatch } from 'store';
import { gridSpacing } from 'store/constant';

import DashboardCharts from './DashboardCharts';
import DashboardHeader from './DashboardHeader';

const Dashboard = () => {
  const { coreInfo } = useAuth();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      setIsLoading(false);
    };

    init();
  }, [dispatch, coreInfo]);

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={gridSpacing}>
        <DashboardHeader isLoading={isLoading} timezone={coreInfo?.timezone} viewerControlMode={coreInfo?.preference?.viewerControlMode} />
        <DashboardCharts
          isLoading={isLoading}
          timezone={coreInfo?.timezone}
          viewerControlMode={coreInfo?.preference?.viewerControlMode}
          coreInfo={coreInfo}
        />
      </Grid>
    </Box>
  );
};

export default Dashboard;
