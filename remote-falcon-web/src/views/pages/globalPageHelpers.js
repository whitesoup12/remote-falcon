import { unexpectedErrorMessage } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';

// eslint-disable-next-line import/prefer-default-export
export const showAlertOld = ({ dispatch, message, alert }) => {
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

export const showAlert = (dispatch, { ...toast }) => {
  dispatch(
    openSnackbar({
      id: toast?.id,
      open: true,
      message: toast?.alert === 'error' && !toast?.message ? unexpectedErrorMessage : toast?.message,
      alert: {
        color: toast?.alert || 'success'
      }
    })
  );
};
