import {
  purgeQueueService,
  resetVotesService,
  allJukeboxRequestsService,
  deleteJukeboxRequestService
} from 'services/controlPanel/headerFunctions.service';
import { unexpectedErrorMessage } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';

export const getAllJukeboxRequests = async (dispatch, setIsFetching, setAllJukeboxRequests, openViewJukeboxRequests, show) => {
  setIsFetching(true);
  try {
    const response = await allJukeboxRequestsService();
    setAllJukeboxRequests({ ...response?.data });
    openViewJukeboxRequests();
  } catch {
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
  setIsFetching(false);
};

export const purgeQueue = async (dispatch, setAllJukeboxRequests, setIsPurging, show) => {
  setIsPurging(true);
  const response = await purgeQueueService();
  if (response?.status === 200) {
    dispatch(
      openSnackbar({
        open: true,
        message: 'Queue Purged',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: true
      })
    );
    const response = await allJukeboxRequestsService();
    setAllJukeboxRequests({ ...response?.data });
  } else {
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
  setIsPurging(false);
};

export const deleteJukeboxRequest = async (dispatch, remoteJukeKey, sequence, setAllJukeboxRequests, setIsDeleting, show) => {
  setIsDeleting(true);
  const response = await deleteJukeboxRequestService(remoteJukeKey);
  if (response?.status === 200) {
    dispatch(
      openSnackbar({
        open: true,
        message: `${sequence} Deleted from Queue`,
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: true
      })
    );
    const response = await allJukeboxRequestsService();
    setAllJukeboxRequests({ ...response?.data });
  } else {
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
  setIsDeleting(false);
};

export const resetVotes = async (dispatch, setIsFetching, show) => {
  setIsFetching(true);
  const response = await resetVotesService();
  if (response?.status === 200) {
    dispatch(
      openSnackbar({
        open: true,
        message: 'Votes Reset',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: true
      })
    );
  } else {
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
  setIsFetching(false);
};
