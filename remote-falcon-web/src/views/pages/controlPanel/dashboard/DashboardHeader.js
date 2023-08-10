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
  totalRequestsService
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

  const fetchActiveViewers = useCallback(async () => {
    const activeViewersResponse = await activeViewersService();
    const activeViewers = activeViewersResponse.data;
    setActiveViewers(activeViewers.toString());
  }, []);

  const fetchTotalViewers = useCallback(async () => {
    const totalViewersResponse = await totalViewersService(
      otherProps.timezone,
      new Date().setHours(0, 0, 0),
      new Date().setHours(23, 59, 59)
    );
    const totalViewers = totalViewersResponse.data;
    setTotalViewers(`${totalViewers} Today`);
  }, [otherProps.timezone]);

  const fetchCurrentRequests = useCallback(async () => {
    const currentRequestsResponse = await currentRequestsService();
    const currentRequests = currentRequestsResponse.data;
    setCurrentRequests(currentRequests.toString());
  }, []);

  const fetchTotalRequests = useCallback(async () => {
    const totalRequestsResponse = await totalRequestsService(
      otherProps.timezone,
      new Date().setHours(0, 0, 0),
      new Date().setHours(23, 59, 59)
    );
    const totalRequests = totalRequestsResponse.data;
    setTotalRequests(`${totalRequests} Today`);
  }, [otherProps.timezone]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchActiveViewers();
      await fetchTotalViewers();
      await fetchCurrentRequests();
      await fetchTotalRequests();
      setIsLoading(false);
    };
    init();
  }, [fetchActiveViewers, fetchTotalViewers, fetchCurrentRequests, fetchTotalRequests]);

  useInterval(async () => {
    fetchActiveViewers();
    fetchTotalViewers();
    fetchCurrentRequests();
    fetchTotalRequests();
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
