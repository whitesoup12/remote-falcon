import fileDownload from 'js-file-download';
import _ from 'lodash';
import moment from 'moment/moment';

import { downloadStatsToExcelService } from 'services/controlPanel/dashboard.service';
import { mixpanelTrack, showAlert } from 'views/pages/globalPageHelpers';

export const uniqueViewersByDate = (dashboardStats) => {
  const data = [];
  _.map(dashboardStats?.viewerPageVisitsByDate, (viewerPageVisit) => {
    data.push([viewerPageVisit.pageVisitDate, viewerPageVisit.uniqueVisits]);
  });
  return {
    yValue: 'Unique Viewers: ',
    data
  };
};

export const totalViewersByDate = (dashboardStats) => {
  const data = [];
  _.map(dashboardStats?.viewerPageVisitsByDate, (viewerPageVisit) => {
    data.push([viewerPageVisit.pageVisitDate, viewerPageVisit.totalVisits]);
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
  _.map(dashboardStats?.jukeboxRequestsByDate, (request) => {
    data.push([request.requestDate, request.totalRequests]);
    _.forEach(request.sequenceRequests, (sequence) => {
      labels.push({
        label: `${sequence.sequenceName}: `,
        value: `<strong>${sequence.sequenceRequests}</strong><br />`
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
  _.map(dashboardStats?.jukeboxRequestsBySequence, (sequenceRequest) => {
    _.forEach(sequenceRequest, (request) => {
      data.push({ x: request.sequenceName, y: request.sequenceRequests });
    });
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
  _.map(dashboardStats?.viewerVoteStatsByDate, (vote) => {
    data.push([vote.voteDate, vote.totalVotes]);
    _.forEach(vote.sequenceVotes, (sequence) => {
      labels.push({
        label: `${sequence.sequenceName}: `,
        value: `<strong>${sequence.sequenceVotes}</strong><br />`
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
  _.map(dashboardStats?.viewerVoteStatsBySequence, (sequenceVote) => {
    _.forEach(sequenceVote, (vote) => {
      data.push({ x: vote.sequenceName, y: vote.sequenceVotes });
    });
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
  _.map(dashboardStats?.viewerVoteWinStatsByDate, (vote) => {
    data.push([vote.voteDate, vote.totalVotes]);
    _.forEach(vote.sequenceWins, (sequence) => {
      labels.push({
        label: `${sequence.sequenceName}: `,
        value: `<strong>${sequence.sequenceWins}</strong><br />`
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
  _.map(dashboardStats?.viewerVoteWinStatsBySequence, (sequenceVoteWins) => {
    _.forEach(sequenceVoteWins, (voteWin) => {
      data.push({ x: voteWin.sequenceName, y: voteWin.sequenceWins });
    });
  });
  return {
    yValue: 'Total Wins: ',
    data
  };
};

export const downloadStatsToExcel = async (dispatch, timezone, dateFilterStart, dateFilterEnd, setIsDownloadingStats, coreInfo) => {
  setIsDownloadingStats(true);
  mixpanelTrack('Dashboard Stats Download', coreInfo);
  const response = await downloadStatsToExcelService(timezone, dateFilterStart, dateFilterEnd);
  if (response?.status === 200) {
    fileDownload(response.data, 'Remote Falcon Stats.xlsx');
    showAlert({ dispatch, message: 'Dashboard Stats Downloaded' });
  } else {
    showAlert({ dispatch, alert: 'error' });
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
      showAlert({ dispatch, message: `Date must be after ${moment(date2YearsAgo).format('YYYY-MM-DD')}`, alert: 'warning' });
    }
  } else {
    showAlert({ dispatch, message: 'Invalid Date Range', alert: 'warning' });
  }
};
