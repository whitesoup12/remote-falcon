import mixpanel from 'mixpanel-browser';

import { unexpectedErrorMessage } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';

export const showAlert = ({ dispatch, message, alert }) => {
  dispatch(
    openSnackbar({
      open: true,
      message: alert === 'error' && !message ? unexpectedErrorMessage : message,
      alert: {
        color: alert || 'success'
      }
    })
  );
};

export const mixpanelTrack = (event, coreInfo) => {
  mixpanel.track(event, { 'Show Name': coreInfo?.remoteName });
};
