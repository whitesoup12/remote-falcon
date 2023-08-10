import axios from 'utils/axios';

export const getExternalViewerPageService = async () => {
  const response = await axios.get('/remotefalcon/api/viewer/viewerPageContents');
  return response;
};

export const getExternalViewerPageDetailsService = async () => {
  const response = await axios.get('/remotefalcon/api/viewer/externalViewerPageDetails');
  return response;
};

export const addSequenceToQueueService = async (request) => {
  const response = await axios.post('/remotefalcon/api/viewer/addPlaylistToQueue', request);
  return response;
};

export const voteForSequenceService = async (request) => {
  const response = await axios.post('/remotefalcon/api/viewer/voteForPlaylist', request);
  return response;
};

export const insertViewerPageStatsService = async () => {
  const response = await axios.post('/remotefalcon/api/viewer/insertViewerPageStats', {
    pageVisitDate: new Date().toISOString()
  });
  return response;
};

export const updateActiveViewerService = async () => {
  const response = await axios.post('/remotefalcon/api/viewer/updateActiveViewer');
  return response;
};
