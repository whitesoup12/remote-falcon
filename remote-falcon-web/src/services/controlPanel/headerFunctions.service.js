import axios from 'utils/axios';

export const purgeQueueService = async () => {
  const response = await axios.delete('/remotefalcon/api/controlPanel/purgeQueue');
  return response;
};

export const resetVotesService = async () => {
  const response = await axios.delete('/remotefalcon/api/controlPanel/resetAllVotes');
  return response;
};

export const allJukeboxRequestsService = async () => {
  const response = await axios.get('/remotefalcon/api/controlPanel/allJukeboxRequests');
  return response;
};

export const deleteJukeboxRequestService = async (remoteJukeKey) => {
  const response = await axios.delete(`/remotefalcon/api/controlPanel/deleteJukeboxRequest/${remoteJukeKey}`);
  return response;
};

export const getNotificationsService = async () => {
  const response = await axios.get('/remotefalcon/api/controlPanel/notifications');
  return response;
};

export const markNotificationAsReadService = async (notificationKey) => {
  const response = await axios.post(`/remotefalcon/api/controlPanel/notifications/markAsRead/${notificationKey}`);
  return response;
};

export const markAllNotificationsAsReadService = async () => {
  const response = await axios.post('/remotefalcon/api/controlPanel/notifications/markAllAsRead');
  return response;
};

export const deleteNotificationService = async (notificationKey) => {
  const response = await axios.delete(`/remotefalcon/api/controlPanel/notifications/${notificationKey}`);
  return response;
};
