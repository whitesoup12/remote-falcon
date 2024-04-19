import moment from 'moment/moment';

// eslint-disable-next-line import/prefer-default-export
export const insertViewerPageStatsService = (insertViewerPageStatsMutation, callback) => {
  insertViewerPageStatsMutation({
    variables: {
      date: moment().format('YYYY-MM-DDTHH:mm:ss')
    },
    onCompleted: () => {
      callback({
        success: true
      });
    },
    onError: () => {
      callback({
        success: false,
        toast: { alert: 'error' }
      });
    }
  });
};
