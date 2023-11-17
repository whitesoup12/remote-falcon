import axios from 'utils/axios';

// eslint-disable-next-line global-require
const newAxios = require('axios');

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

export const getRemoteViewerPageTemplatesFromGithubService = async () => {
  const viewerPages = [];
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  const theOG = await newAxios.get(
    'https://raw.githubusercontent.com/whitesoup12/remote-falcon-page-templates/main/templates/the-og.html',
    config
  );
  const purpleHalloween = await newAxios.get(
    'https://raw.githubusercontent.com/whitesoup12/remote-falcon-page-templates/main/templates/purple-halloween.html',
    config
  );
  const redAndWhite = await newAxios.get(
    'https://raw.githubusercontent.com/whitesoup12/remote-falcon-page-templates/main/templates/red-and-white.html',
    config
  );
  const onAir = await newAxios.get(
    'https://raw.githubusercontent.com/whitesoup12/remote-falcon-page-templates/main/templates/on-air.html',
    config
  );
  const lls = await newAxios.get(
    'https://raw.githubusercontent.com/whitesoup12/remote-falcon-page-templates/main/templates/lumos-light-show.html',
    config
  );
  viewerPages.push({ key: 1, title: 'The OG by Rick Harris', content: theOG.data });
  viewerPages.push({ key: 2, title: 'Purple Halloween by StramMade3D', content: purpleHalloween.data });
  viewerPages.push({ key: 3, title: 'Red & White by StramMade3D', content: redAndWhite.data });
  viewerPages.push({ key: 4, title: 'On Air by Jason Toy', content: onAir.data });
  viewerPages.push({ key: 5, title: 'Lumos Light Show by James Vance', content: lls.data });

  return viewerPages;
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
