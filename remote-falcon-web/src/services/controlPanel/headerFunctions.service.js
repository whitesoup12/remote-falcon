import axios from 'utils/axios';

export const purgeQueueService = async () => {
  const response = await axios.delete('/remote-falcon-control-panel/controlPanel/purgeQueue');
  return response;
};

export const resetVotesService = async () => {
  const response = await axios.delete('/remote-falcon-control-panel/controlPanel/resetAllVotes');
  return response;
};

export const allJukeboxRequestsService = async () => {
  const response = await axios.get('/remote-falcon-control-panel/controlPanel/allJukeboxRequests');
  return response;
};

export const deleteJukeboxRequestService = async (remoteJukeKey) => {
  const response = await axios.delete(`/remote-falcon-control-panel/controlPanel/deleteJukeboxRequest/${remoteJukeKey}`);
  return response;
};

export const getNotificationsService = async () => {
  const response = await axios.get('/remote-falcon-control-panel/controlPanel/notifications');
  return response;
};

export const markNotificationAsReadService = async (notificationKey) => {
  const response = await axios.post(`/remote-falcon-control-panel/controlPanel/notifications/markAsRead/${notificationKey}`);
  return response;
};

export const markAllNotificationsAsReadService = async () => {
  const response = await axios.post('/remote-falcon-control-panel/controlPanel/notifications/markAllAsRead');
  return response;
};

export const deleteNotificationService = async (notificationKey) => {
  const response = await axios.delete(`/remote-falcon-control-panel/controlPanel/notifications/${notificationKey}`);
  return response;
};
