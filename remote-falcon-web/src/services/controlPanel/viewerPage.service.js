import axios from 'utils/axios';

export const getDefaultViewerPageContentService = async () => {
  const response = await axios.get('/remotefalcon/api/controlPanel/getDefaultViewerPageContent');
  return response;
};

export const getRemoteViewerPagesService = async () => {
  const response = await axios.get('/remotefalcon/api/controlPanel/remoteViewerPages');
  return response;
};

export const addRemoteViewerPageService = async (remoteViewerPage) => {
  const response = await axios.post('/remotefalcon/api/controlPanel/addRemoteViewerPage', {
    viewerPageName: remoteViewerPage.viewerPageName,
    viewerPageActive: false,
    viewerPageHtml: remoteViewerPage.viewerPageHtml
  });
  return response;
};

export const deleteRemoteViewerPageService = async (remoteViewerPageKey) => {
  const response = await axios.delete(`/remotefalcon/api/controlPanel/deleteRemoteViewerPage/${remoteViewerPageKey}`);
  return response;
};

export const getRemoteViewerPageTemplatesService = async () => {
  const response = await axios.get('/remotefalcon/api/controlPanel/remoteViewerPageTemplates');
  return response;
};

export const getRemoteViewerPageService = async (remoteViewerPageKey) => {
  const response = await axios.get(`/remotefalcon/api/controlPanel/remoteViewerPage/${remoteViewerPageKey}`);
  return response;
};

export const saveRemoteViewerPageService = async (remoteViewerPage) => {
  const response = await axios.post('/remotefalcon/api/controlPanel/saveRemoteViewerPage', {
    ...remoteViewerPage
  });
  return response;
};

export const validateHtmlService = async (html) => {
  // eslint-disable-next-line global-require
  const newAxios = require('axios');
  const url = 'https://validator.nu/';
  const formData = new FormData();
  formData.append('out', 'json');
  formData.append('parser', 'html');
  formData.append('content', html);
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  const response = await newAxios.post(url, formData, config);
  return response;
};
