import { useEffect, useState, useCallback } from 'react';

import { useLazyQuery } from '@apollo/client';
import PeopleTwoTone from '@mui/icons-material/PeopleTwoTone';
import ThumbUpTwoTone from '@mui/icons-material/ThumbUpTwoTone';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';

import useInterval from 'hooks/useInterval';
import RevenueCard from 'ui-component/cards/RevenueCard';
import DashboardStatsSkeleton from 'ui-component/cards/Skeleton/DashboardStatsSkeleton';

import { ViewerControlMode } from '../../../../utils/enum';
import { dashboardLiveStatsQql } from '../../../../utils/graphql/dashboard/queries';

const DashboardHeader = ({ ...otherProps }) => {
  const theme = useTheme();

  const [activeViewers, setActiveViewers] = useState('0');
  const [totalViewers, setTotalViewers] = useState('0');
  const [currentRequests, setCurrentRequests] = useState('0');
  const [totalRequests, setTotalRequests] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  const [dashboardLiveStatsQuery] = useLazyQuery(dashboardLiveStatsQql);

  const fetchDashboardLiveStats = useCallback(async () => {
    await dashboardLiveStatsQuery({
      variables: {
        startDate: new Date().setHours(0, 0, 0),
        endDate: new Date().setHours(23, 59, 59),
        timezone: otherProps.timezone
      }
    }).then((response) => {
      const dashboardLiveStats = response?.data?.dashboardLiveStats;

      setActiveViewers(dashboardLiveStats?.activeViewers?.toString());
      setTotalViewers(`${dashboardLiveStats?.totalViewers} Today`);
      setCurrentRequests(dashboardLiveStats?.currentRequests?.toString());
      setTotalRequests(`${dashboardLiveStats?.totalRequests} Today`);
    });
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
            primary={otherProps.viewerControlMode === ViewerControlMode.JUKEBOX ? 'Active Requests' : 'Active Votes'}
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
