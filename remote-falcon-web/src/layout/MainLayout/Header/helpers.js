import {
  purgeQueueService,
  resetVotesService,
  allJukeboxRequestsService,
  deleteJukeboxRequestService
} from 'services/controlPanel/headerFunctions.service';
import { unexpectedErrorMessage } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import { mixpanelTrack } from 'views/pages/globalPageHelpers';

export const getAllJukeboxRequests = async (dispatch, setIsFetching, setAllJukeboxRequests, openViewJukeboxRequests, coreInfo) => {
  setIsFetching(true);
  mixpanelTrack('View All Requests', coreInfo);
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

export const purgeQueue = async (dispatch, setAllJukeboxRequests, setIsPurging, coreInfo) => {
  setIsPurging(true);
  mixpanelTrack('Delete All Requests', coreInfo);
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

export const deleteJukeboxRequest = async (dispatch, remoteJukeKey, sequence, setAllJukeboxRequests, setIsDeleting, coreInfo) => {
  setIsDeleting(true);
  mixpanelTrack('Delete Single Request', coreInfo);
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

export const resetVotes = async (dispatch, setIsFetching, coreInfo) => {
  setIsFetching(true);
  mixpanelTrack('Reset Votes', coreInfo);
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
