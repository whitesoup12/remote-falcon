import { unexpectedErrorMessage } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';

// eslint-disable-next-line import/prefer-default-export
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
