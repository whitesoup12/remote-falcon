const newAxios = require('axios');

// eslint-disable-next-line import/prefer-default-export
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
