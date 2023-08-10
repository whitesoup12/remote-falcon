import axios from 'utils/axios';

export const remotePrefsService = async () => {
  const response = await axios.get('/remotefalcon/api/controlPanel/remotePrefs');
  return response;
};

export const saveRemotePrefsService = async (viewerSettings) => {
  const response = await axios.post('/remotefalcon/api/controlPanel/remotePrefs', {
    ...viewerSettings
  });
  return response;
};

export const getExternalViewerPageMetaService = async () => {
  const response = await axios.get('/remotefalcon/api/controlPanel/getViewerPageMeta');
  return response;
};

export const saveExternalViewerPageMetaService = async (externalViewerPageMeta) => {
  const response = await axios.post('/remotefalcon/api/controlPanel/saveViewerPageMeta', {
    ...externalViewerPageMeta
  });
  return response;
};
