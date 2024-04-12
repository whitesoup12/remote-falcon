import { useEffect, useState, useCallback } from 'react';

import { useLazyQuery } from '@apollo/client';
import { Grid, TextField, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useDispatch, useSelector } from 'store';
import MainCard from 'ui-component/cards/MainCard';
import DashboardChartsSkeleton from 'ui-component/cards/Skeleton/DashboardChartsSkeleton';
import SubCard from 'ui-component/cards/SubCard';
import RFLoadingButton from 'ui-component/RFLoadingButton';
import { ViewerControlMode } from 'utils/enum';
import { DASHBOARD_STATS } from 'utils/graphql/queries';

import { showAlertOld } from '../../globalPageHelpers';
import ApexBarChart from './ApexBarChart';
import ApexLineChart from './ApexLineChart';
import {
  uniqueViewersByDate,
  totalViewersByDate,
  sequenceRequestsByDate,
  sequenceRequests,
  sequenceVotesByDate,
  sequenceVotes,
  sequenceVoteWinsByDate,
  sequenceVoteWins,
  downloadStatsToExcel,
  validateDatePicker
} from './index.service';

const DashboardCharts = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.show);

  const dateMinus7 = new Date();
  dateMinus7.setDate(dateMinus7.getDate() - 7);

  const [dashboardStatsQuery] = useLazyQuery(DASHBOARD_STATS);

  const [dateFilterStart, setDateFilterStart] = useState(dateMinus7.setHours(0, 0, 0));
  const [dateFilterEnd, setDateFilterEnd] = useState(new Date().setHours(23, 59, 59));
  const [dashboardStats, setDashboardStats] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isDownloadingStats, setIsDownloadingStats] = useState(false);

  const fetchDashboardStats = useCallback(async () => {
    await dashboardStatsQuery({
      variables: {
        startDate: dateFilterStart,
        endDate: dateFilterEnd,
        timezone: show?.preferences?.timezone
      },
      onCompleted: (data) => {
        console.log(show?.preferences?.viewerControlMode);
        setDashboardStats(data?.dashboardStats);
      },
      onError: () => {
        showAlertOld({ dispatch, alert: 'error' });
      }
    });
  }, [dispatch, dateFilterStart, dateFilterEnd, show?.preferences?.timezone]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchDashboardStats();
      setLoading(false);
    };
    init();
  }, [fetchDashboardStats]);

  return (
    <>
      <Grid item xs={12} md={12}>
        <SubCard title="Dashboard Date Filter">
          <Stack direction="row" spacing={2} justifyContent="left" pb={2} pl={0.5}>
            <Typography variant="h5" color={theme.palette.error.main}>
              Stats are automatically deleted after 18 months
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                renderInput={(props) => <TextField fullWidth {...props} helperText="" />}
                label="Start Date"
                value={dateFilterStart}
                onChange={(newValue) => {
                  validateDatePicker(dispatch, newValue?.setHours(0, 0, 0), dateFilterEnd, setDateFilterStart, setDateFilterEnd);
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                renderInput={(props) => <TextField fullWidth {...props} helperText="" />}
                label="End Date"
                value={dateFilterEnd}
                onChange={(newValue) => {
                  validateDatePicker(dispatch, dateFilterStart, newValue?.setHours(23, 59, 59), setDateFilterStart, setDateFilterEnd);
                }}
              />
            </LocalizationProvider>
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="right" pt={2}>
            <RFLoadingButton
              loading={isDownloadingStats}
              onClick={() => downloadStatsToExcel(dispatch, show?.preferences?.timezone, setIsDownloadingStats)}
              color="primary"
            >
              Download Stats
            </RFLoadingButton>
          </Stack>
        </SubCard>
      </Grid>
      {isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        <Grid item xs={12} md={6} lg={6}>
          <MainCard title="Unique Viewers by Date" sx={{ overflow: 'visible' }}>
            <ApexLineChart chartData={uniqueViewersByDate(dashboardStats)} />
          </MainCard>
        </Grid>
      )}
      {isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        <Grid item xs={12} md={6} lg={6}>
          <MainCard title="Total Viewers by Date" sx={{ overflow: 'visible' }}>
            <ApexLineChart chartData={totalViewersByDate(dashboardStats)} />
          </MainCard>
        </Grid>
      )}
      {isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        show?.preferences?.viewerControlMode === ViewerControlMode.JUKEBOX && (
          <Grid item xs={12} md={6} lg={6}>
            <MainCard title="Sequence Requests by Date" sx={{ overflow: 'visible' }}>
              <ApexLineChart chartData={sequenceRequestsByDate(dashboardStats)} />
            </MainCard>
          </Grid>
        )
      )}
      {isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        show?.preferences?.viewerControlMode === ViewerControlMode.JUKEBOX && (
          <Grid item xs={12} md={6} lg={6}>
            <MainCard title="Sequence Requests" sx={{ overflow: 'visible' }}>
              <ApexBarChart chartData={sequenceRequests(dashboardStats)} />
            </MainCard>
          </Grid>
        )
      )}
      {isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        show?.preferences?.viewerControlMode === ViewerControlMode.VOTING && (
          <Grid item xs={12} md={6} lg={6}>
            <MainCard title="Sequence Votes by Date" sx={{ overflow: 'visible' }}>
              <ApexLineChart chartData={sequenceVotesByDate(dashboardStats)} />
            </MainCard>
          </Grid>
        )
      )}
      {isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        show?.preferences?.viewerControlMode === ViewerControlMode.VOTING && (
          <Grid item xs={12} md={6} lg={6}>
            <MainCard title="Sequence Votes" sx={{ overflow: 'visible' }}>
              <ApexBarChart chartData={sequenceVotes(dashboardStats)} />
            </MainCard>
          </Grid>
        )
      )}
      {isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        show?.preferences?.viewerControlMode === ViewerControlMode.VOTING && (
          <Grid item xs={12} md={6} lg={6}>
            <MainCard title="Total Wins by Date" sx={{ overflow: 'visible' }}>
              <ApexLineChart chartData={sequenceVoteWinsByDate(dashboardStats)} />
            </MainCard>
          </Grid>
        )
      )}
      {isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        show?.preferences?.viewerControlMode === ViewerControlMode.VOTING && (
          <Grid item xs={12} md={6} lg={6}>
            <MainCard title="Sequence Wins" sx={{ overflow: 'visible' }}>
              <ApexBarChart chartData={sequenceVoteWins(dashboardStats)} />
            </MainCard>
          </Grid>
        )
      )}
    </>
  );
};

export default DashboardCharts;
