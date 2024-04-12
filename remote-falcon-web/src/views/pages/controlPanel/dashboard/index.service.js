import fileDownload from 'js-file-download';
import _ from 'lodash';
import moment from 'moment/moment';

import { downloadStatsToExcelService } from 'services/controlPanel/dashboard.service';
import { showAlertOld } from 'views/pages/globalPageHelpers';

export const uniqueViewersByDate = (dashboardStats) => {
  const data = [];
  _.map(dashboardStats?.page, (viewerPageVisit) => {
    data.push([viewerPageVisit.date, viewerPageVisit.unique]);
  });
  return {
    yValue: 'Unique Viewers: ',
    data
  };
};

export const totalViewersByDate = (dashboardStats) => {
  const data = [];
  _.map(dashboardStats?.page, (viewerPageVisit) => {
    data.push([viewerPageVisit.date, viewerPageVisit.total]);
  });
  return {
    yValue: 'Total Viewers: ',
    data
  };
};

export const sequenceRequestsByDate = (dashboardStats) => {
  const seriesLabels = [];
  const data = [];
  let labels = [];
  _.map(dashboardStats?.jukeboxByDate, (request) => {
    data.push([request.date, request.total]);
    _.forEach(request.sequences, (sequence) => {
      labels.push({
        label: `${sequence.name}: `,
        value: `<strong>${sequence.total}</strong><br />`
      });
    });
    seriesLabels.push(labels);
    labels = [];
  });
  return {
    yValue: 'Total Requests: ',
    seriesLabels,
    data
  };
};

export const sequenceRequests = (dashboardStats) => {
  const data = [];
  _.forEach(dashboardStats?.jukeboxBySequence?.sequences, (sequence) => {
    data.push({ x: sequence.name, y: sequence.total });
  });
  return {
    yValue: 'Total Requests: ',
    data
  };
};

export const sequenceVotesByDate = (dashboardStats) => {
  const seriesLabels = [];
  const data = [];
  let labels = [];
  _.map(dashboardStats?.votingByDate, (vote) => {
    data.push([vote.date, vote.total]);
    _.forEach(vote.sequences, (sequence) => {
      labels.push({
        label: `${sequence.name}: `,
        value: `<strong>${sequence.total}</strong><br />`
      });
    });
    seriesLabels.push(labels);
    labels = [];
  });
  return {
    yValue: 'Total Votes: ',
    seriesLabels,
    data
  };
};

export const sequenceVotes = (dashboardStats) => {
  const data = [];
  _.forEach(dashboardStats?.votingBySequence?.sequences, (vote) => {
    data.push({ x: vote.name, y: vote.total });
  });
  return {
    yValue: 'Total Votes: ',
    data
  };
};

export const sequenceVoteWinsByDate = (dashboardStats) => {
  const seriesLabels = [];
  const data = [];
  let labels = [];
  _.map(dashboardStats?.votingWinByDate, (vote) => {
    data.push([vote.date, vote.total]);
    _.forEach(vote.sequences, (sequence) => {
      labels.push({
        label: `${sequence.name}: `,
        value: `<strong>${sequence.total}</strong><br />`
      });
    });
    seriesLabels.push(labels);
    labels = [];
  });
  return {
    yValue: 'Total Wins: ',
    seriesLabels,
    data
  };
};

export const sequenceVoteWins = (dashboardStats) => {
  const data = [];
  _.forEach(dashboardStats?.votingWinBySequence?.sequences, (voteWin) => {
    data.push({ x: voteWin.name, y: voteWin.total });
  });
  return {
    yValue: 'Total Wins: ',
    data
  };
};

export const downloadStatsToExcel = async (dispatch, timezone, setIsDownloadingStats) => {
  setIsDownloadingStats(true);
  const response = await downloadStatsToExcelService(timezone);
  if (response?.status === 200) {
    fileDownload(response.data, 'Remote Falcon Stats.xlsx');
    showAlertOld({ dispatch, message: 'Dashboard Stats Downloaded' });
  } else {
    showAlertOld({ dispatch, alert: 'error' });
  }
  setIsDownloadingStats(false);
};

function subtractYears(date, years) {
  date.setFullYear(date.getFullYear() - years);
  return date;
}

export const validateDatePicker = (dispatch, startDate, endDate, setDateFilterStart, setDateFilterEnd) => {
  const date2YearsAgo = subtractYears(new Date(), 2);
  if (moment.unix(startDate).isValid() && moment.unix(endDate).isValid() && moment.unix(startDate).isBefore(moment.unix(endDate))) {
    if (
      moment.unix(startDate).isAfter(moment.unix(date2YearsAgo).subtract(2, 'years')) &&
      moment.unix(endDate).isAfter(moment.unix(date2YearsAgo).subtract(2, 'years'))
    ) {
      setDateFilterStart(startDate);
      setDateFilterEnd(endDate);
    } else {
      showAlertOld({ dispatch, message: `Date must be after ${moment(date2YearsAgo).format('YYYY-MM-DD')}`, alert: 'warning' });
    }
  } else {
    showAlertOld({ dispatch, message: 'Invalid Date Range', alert: 'warning' });
  }
};
