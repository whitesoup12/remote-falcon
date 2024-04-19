import axios from 'utils/axios';

export const getExternalViewerPageService = async () => {
  const response = await axios.get('/remote-falcon-control-panel/viewer/viewerPageContents');
  return response;
};

export const getExternalViewerPageDetailsService = async () => {
  const response = await axios.get('/remote-falcon-control-panel/viewer/externalViewerPageDetails');
  return response;
};

export const addSequenceToQueueService = async (request) => {
  const response = await axios.post('/remote-falcon-control-panel/viewer/addPlaylistToQueue', request);
  return response;
};

export const voteForSequenceService = async (request) => {
  const response = await axios.post('/remote-falcon-control-panel/viewer/voteForPlaylist', request);
  return response;
};

export const updateActiveViewerService = async () => {
  const response = await axios.post('/remote-falcon-control-panel/viewer/updateActiveViewer');
  return response;
};
