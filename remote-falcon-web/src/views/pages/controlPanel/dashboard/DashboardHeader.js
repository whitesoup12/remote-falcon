import { useEffect, useState, useCallback } from 'react';

import PeopleTwoTone from '@mui/icons-material/PeopleTwoTone';
import ThumbUpTwoTone from '@mui/icons-material/ThumbUpTwoTone';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';

import useInterval from 'hooks/useInterval';
import {
  activeViewersService,
  totalViewersService,
  currentRequestsService,
  totalRequestsService,
  dashboardLiveStatsService
} from 'services/controlPanel/dashboard.service';
import RevenueCard from 'ui-component/cards/RevenueCard';
import DashboardStatsSkeleton from 'ui-component/cards/Skeleton/DashboardStatsSkeleton';

const DashboardHeader = ({ ...otherProps }) => {
  const theme = useTheme();

  const [activeViewers, setActiveViewers] = useState('0');
  const [totalViewers, setTotalViewers] = useState('0');
  const [currentRequests, setCurrentRequests] = useState('0');
  const [totalRequests, setTotalRequests] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardLiveStats = useCallback(async () => {
    const dashboardLiveStatsResponse = await dashboardLiveStatsService(
      otherProps.timezone,
      new Date().setHours(0, 0, 0),
      new Date().setHours(23, 59, 59)
    );
    const dashboardLiveStats = dashboardLiveStatsResponse.data;
    const activeViewers = dashboardLiveStats?.activeViewers;
    const totalViewers = dashboardLiveStats?.totalViewers;
    const currentRequests = dashboardLiveStats?.currentRequests;
    const totalRequests = dashboardLiveStats?.totalRequests;

    setActiveViewers(activeViewers.toString());
    setTotalViewers(`${totalViewers} Today`);
    setCurrentRequests(currentRequests.toString());
    setTotalRequests(`${totalRequests} Today`);
  }, [otherProps.timezone]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchDashboardLiveStats();
      setIsLoading(false);
    };
    init();
  }, [fetchDashboardLiveStats]);

  useInterval(async () => {
    await fetchDashboardLiveStats();
  }, 5000);

  return (
    <>
      {isLoading ? (
        <DashboardStatsSkeleton />
      ) : (
        <Grid item xs={12} md={6} lg={6}>
          <RevenueCard
            primary="Active Viewers"
            secondary={activeViewers}
            content={totalViewers}
            iconPrimary={PeopleTwoTone}
            color={theme.palette.secondary.main}
          />
        </Grid>
      )}
      {isLoading ? (
        <DashboardStatsSkeleton />
      ) : (
        <Grid item xs={12} md={6} lg={6}>
          <RevenueCard
            primary={otherProps.viewerControlMode === 'jukebox' ? 'Active Requests' : 'Active Votes'}
            secondary={currentRequests}
            content={totalRequests}
            iconPrimary={ThumbUpTwoTone}
            color={theme.palette.primary.main}
          />
        </Grid>
      )}
    </>
  );
};

DashboardHeader.propTypes = {
  isLoading: PropTypes.bool,
  viewerControlMode: PropTypes.string
};

export default DashboardHeader;
