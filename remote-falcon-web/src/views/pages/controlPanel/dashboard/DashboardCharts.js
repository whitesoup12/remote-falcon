import { useEffect, useState, useCallback } from 'react';

import { Grid, TextField, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types';

import { dashboardStatsService } from 'services/controlPanel/dashboard.service';
import { useDispatch } from 'store';
import { unexpectedErrorMessage } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';
import DashboardChartsSkeleton from 'ui-component/cards/Skeleton/DashboardChartsSkeleton';
import SubCard from 'ui-component/cards/SubCard';
import RFLoadingButton from 'ui-component/RFLoadingButton';

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
} from './helpers';

const DashboardCharts = ({ ...otherProps }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const dateMinus7 = new Date();
  dateMinus7.setDate(dateMinus7.getDate() - 7);

  const [dateFilterStart, setDateFilterStart] = useState(dateMinus7.setHours(0, 0, 0));
  const [dateFilterEnd, setDateFilterEnd] = useState(new Date().setHours(23, 59, 59));
  const [dashboardStats, setDashboardStats] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isDownloadingStats, setIsDownloadingStats] = useState(false);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const dashboardStatsResponse = await dashboardStatsService(otherProps.timezone, dateFilterStart, dateFilterEnd);
      const dashboardStats = dashboardStatsResponse.data;
      setDashboardStats(dashboardStats);
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
  }, [dispatch, dateFilterStart, dateFilterEnd, otherProps.timezone]);

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
              onClick={() =>
                downloadStatsToExcel(
                  dispatch,
                  otherProps.timezone,
                  dateFilterStart,
                  dateFilterEnd,
                  setIsDownloadingStats,
                  otherProps.coreInfo
                )
              }
              color="primary"
            >
              Download Stats
            </RFLoadingButton>
          </Stack>
        </SubCard>
      </Grid>
      {isLoading || otherProps.isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        <Grid item xs={12} md={6} lg={6}>
          <MainCard title="Unique Viewers by Date">
            <ApexLineChart chartData={uniqueViewersByDate(dashboardStats)} />
          </MainCard>
        </Grid>
      )}
      {isLoading || otherProps.isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        <Grid item xs={12} md={6} lg={6}>
          <MainCard title="Total Viewers by Date">
            <ApexLineChart chartData={totalViewersByDate(dashboardStats)} />
          </MainCard>
        </Grid>
      )}
      {isLoading || otherProps.isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        otherProps.viewerControlMode === 'jukebox' && (
          <Grid item xs={12} md={6} lg={6}>
            <MainCard title="Sequence Requests by Date">
              <ApexLineChart chartData={sequenceRequestsByDate(dashboardStats)} />
            </MainCard>
          </Grid>
        )
      )}
      {isLoading || otherProps.isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        otherProps.viewerControlMode === 'jukebox' && (
          <Grid item xs={12} md={6} lg={6}>
            <MainCard title="Sequence Requests">
              <ApexBarChart chartData={sequenceRequests(dashboardStats)} />
            </MainCard>
          </Grid>
        )
      )}
      {isLoading || otherProps.isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        otherProps.viewerControlMode === 'voting' && (
          <Grid item xs={12} md={6} lg={6}>
            <MainCard title="Sequence Votes by Date">
              <ApexLineChart chartData={sequenceVotesByDate(dashboardStats)} />
            </MainCard>
          </Grid>
        )
      )}
      {isLoading || otherProps.isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        otherProps.viewerControlMode === 'voting' && (
          <Grid item xs={12} md={6} lg={6}>
            <MainCard title="Sequence Votes">
              <ApexBarChart chartData={sequenceVotes(dashboardStats)} />
            </MainCard>
          </Grid>
        )
      )}
      {isLoading || otherProps.isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        otherProps.viewerControlMode === 'voting' && (
          <Grid item xs={12} md={6} lg={6}>
            <MainCard title="Total Wins by Date">
              <ApexLineChart chartData={sequenceVoteWinsByDate(dashboardStats)} />
            </MainCard>
          </Grid>
        )
      )}
      {isLoading || otherProps.isLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        otherProps.viewerControlMode === 'voting' && (
          <Grid item xs={12} md={6} lg={6}>
            <MainCard title="Sequence Wins">
              <ApexBarChart chartData={sequenceVoteWins(dashboardStats)} />
            </MainCard>
          </Grid>
        )
      )}
    </>
  );
};

DashboardCharts.propTypes = {
  isLoading: PropTypes.bool,
  timezone: PropTypes.string,
  viewerControlMode: PropTypes.string
};

export default DashboardCharts;
