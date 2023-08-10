import ControlCameraTwoToneIcon from '@mui/icons-material/ControlCameraTwoTone';
import HowToVoteTwoToneIcon from '@mui/icons-material/HowToVoteTwoTone';
import HtmlTwoToneIcon from '@mui/icons-material/HtmlTwoTone';
import LayersTwoToneIcon from '@mui/icons-material/LayersTwoTone';
import LibraryMusicTwoToneIcon from '@mui/icons-material/LibraryMusicTwoTone';
import _ from 'lodash';

import { saveRemotePrefsService, saveExternalViewerPageMetaService } from 'services/controlPanel/viewerSettings.service';
import { setRemotePrefs, setExternalViewerPageMeta } from 'store/slices/controlPanel';
import { showAlert } from 'views/pages/globalPageHelpers';

export const saveViewerSettings = async (
  dispatch,
  coreInfo,
  remotePrefs,
  currentLatitude,
  currentLongitude,
  setShowLinearProgress,
  setRemotePrefs,
  setCoreInfo
) => {
  setShowLinearProgress(true);
  const updatedRemotePrefs = _.cloneDeep(remotePrefs);
  if (!remotePrefs?.checkViewerPresent) {
    updatedRemotePrefs.enableGeolocation = false;
    updatedRemotePrefs.enableLocationCode = false;
  }
  if (updatedRemotePrefs.enableGeolocation) {
    updatedRemotePrefs.remoteLatitude = currentLatitude;
    updatedRemotePrefs.remoteLongitude = currentLongitude;
  }
  const response = await saveRemotePrefsService(updatedRemotePrefs);
  if (response?.status === 200) {
    dispatch(setRemotePrefs({ ...updatedRemotePrefs }));
    const updatedCoreInfo = _.cloneDeep(coreInfo);
    updatedCoreInfo.viewerControlMode = updatedRemotePrefs.viewerControlMode;
    dispatch(setCoreInfo({ ...updatedCoreInfo }));
    showAlert({ dispatch, message: 'Viewer Settings Saved' });
  } else {
    showAlert({ dispatch, alert: 'error' });
  }
  setShowLinearProgress(false);
};

export const getDefaultSequencesForPSA = (remotePrefs, setDefaultPsaSequences) => {
  const selectedPsaSequenceList = [];
  _.forEach(remotePrefs?.psaSequenceList, (sequence) =>
    selectedPsaSequenceList.push({ title: sequence.psaSequenceName, id: sequence.psaSequenceName })
  );
  setDefaultPsaSequences(selectedPsaSequenceList);
};

export const getRemoteViewerPages = (remotePrefs, setRemoteViewerPages) => {
  const remoteViewerPages = [];
  _.forEach(remotePrefs?.remoteViewerPages, (viewerPage) => {
    remoteViewerPages.push({ label: viewerPage, id: viewerPage });
  });
  setRemoteViewerPages(remoteViewerPages);
};

export const handleSwitchChange = async (
  event,
  value,
  dispatch,
  coreInfo,
  remotePrefs,
  currentLatitude,
  currentLongitude,
  setShowLinearProgress,
  setRemotePrefs,
  setCoreInfo
) => {
  const updatedRemotePrefs = _.cloneDeep({
    ...remotePrefs,
    [event?.target?.name]: value
  });
  dispatch(setRemotePrefs(updatedRemotePrefs));
  saveViewerSettings(
    dispatch,
    coreInfo,
    updatedRemotePrefs,
    currentLatitude,
    currentLongitude,
    setShowLinearProgress,
    setRemotePrefs,
    setCoreInfo
  );
};

export const handleCheckViewerPresentChange = (
  event,
  value,
  dispatch,
  coreInfo,
  remotePrefs,
  currentLatitude,
  currentLongitude,
  setShowLinearProgress,
  setRemotePrefs,
  setCoreInfo
) => {
  const updatedRemotePrefs = _.cloneDeep({
    ...remotePrefs,
    [event?.target?.name]: value,
    enableGeolocation: !remotePrefs?.checkViewerPresent && !remotePrefs?.enableLocationCode && value
  });
  dispatch(setRemotePrefs(updatedRemotePrefs));
  saveViewerSettings(
    dispatch,
    coreInfo,
    updatedRemotePrefs,
    currentLatitude,
    currentLongitude,
    setShowLinearProgress,
    setRemotePrefs,
    setCoreInfo
  );
};

export const handleViewerControlModeChange = (
  event,
  value,
  dispatch,
  coreInfo,
  remotePrefs,
  currentLatitude,
  currentLongitude,
  setShowLinearProgress,
  setRemotePrefs,
  setCoreInfo
) => {
  const updatedRemotePrefs = _.cloneDeep({
    ...remotePrefs,
    viewerControlMode: value.id
  });
  dispatch(setRemotePrefs(updatedRemotePrefs));
  saveViewerSettings(
    dispatch,
    coreInfo,
    updatedRemotePrefs,
    currentLatitude,
    currentLongitude,
    setShowLinearProgress,
    setRemotePrefs,
    setCoreInfo
  );
};

export const handleViewerPageChange = (
  event,
  value,
  dispatch,
  coreInfo,
  remotePrefs,
  currentLatitude,
  currentLongitude,
  setShowLinearProgress,
  setRemotePrefs,
  setCoreInfo
) => {
  const updatedRemotePrefs = _.cloneDeep({
    ...remotePrefs,
    activeRemoteViewerPage: value.id
  });
  dispatch(setRemotePrefs(updatedRemotePrefs));
  saveViewerSettings(
    dispatch,
    coreInfo,
    updatedRemotePrefs,
    currentLatitude,
    currentLongitude,
    setShowLinearProgress,
    setRemotePrefs,
    setCoreInfo
  );
};

export const handleViewerPresentModeChange = (
  event,
  value,
  dispatch,
  coreInfo,
  remotePrefs,
  currentLatitude,
  currentLongitude,
  setShowLinearProgress,
  setRemotePrefs,
  setCoreInfo
) => {
  const updatedRemotePrefs = _.cloneDeep({
    ...remotePrefs,
    viewerPresentMode: value.id,
    enableGeolocation: value.id === 'gps',
    enableLocationCode: value.id === 'code'
  });
  dispatch(setRemotePrefs(updatedRemotePrefs));
  saveViewerSettings(
    dispatch,
    coreInfo,
    updatedRemotePrefs,
    currentLatitude,
    currentLongitude,
    setShowLinearProgress,
    setRemotePrefs,
    setCoreInfo
  );
};

export const handlePsaSequenceChange = (
  event,
  value,
  dispatch,
  coreInfo,
  remotePrefs,
  currentLatitude,
  currentLongitude,
  setShowLinearProgress,
  setRemotePrefs,
  setCoreInfo
) => {
  const psaSequenceList = [];
  value.forEach((psaSequence, index) => {
    psaSequenceList.push({ psaSequenceName: psaSequence.id, psaSequenceOrder: index });
    index += 1;
  });
  const updatedRemotePrefs = _.cloneDeep({
    ...remotePrefs,
    psaSequenceList
  });
  dispatch(setRemotePrefs(updatedRemotePrefs));
  saveViewerSettings(
    dispatch,
    coreInfo,
    updatedRemotePrefs,
    currentLatitude,
    currentLongitude,
    setShowLinearProgress,
    setRemotePrefs,
    setCoreInfo
  );
};

export const handleNumberChange = (event, value, dispatch, remotePrefs) => {
  dispatch(
    setRemotePrefs({
      ...remotePrefs,
      [event?.target?.name]: parseInt(event?.target?.value, 10)
    })
  );
};

export const handleDecimalChange = (event, value, dispatch, remotePrefs) => {
  dispatch(
    setRemotePrefs({
      ...remotePrefs,
      [event?.target?.name]: parseFloat(event?.target?.value, 10)
    })
  );
};

export const handleExternalViewerPageMetaChange = (event, value, dispatch, externalViewerPageMeta) => {
  dispatch(
    setExternalViewerPageMeta({
      ...externalViewerPageMeta,
      [event?.target?.name]: event?.target?.value
    })
  );
};

export const handleCurrentLatitudeChange = (event, value, setCurrentLatitude) => {
  setCurrentLatitude(event?.target?.value);
};

export const handleCurrentLongitudeChange = (event, value, setCurrentLongitude) => {
  setCurrentLongitude(event?.target?.value);
};

export const refreshLocation = (setCurrentLatitude, setCurrentLongitude) => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLatitude(position.coords.latitude.toFixed(5));
      setCurrentLongitude(position.coords.longitude.toFixed(5));
    });
  }
};

export const saveExternalViewerPageMeta = async (dispatch, externalViewerPageMeta, setShowLinearProgress, setExternalViewerPageMeta) => {
  setShowLinearProgress(true);
  const externalViewerPageMetaResponse = await saveExternalViewerPageMetaService(externalViewerPageMeta);
  if (externalViewerPageMetaResponse?.status === 200) {
    dispatch(
      setExternalViewerPageMeta({
        ...externalViewerPageMetaResponse.data
      })
    );
    showAlert({ dispatch, message: 'Viewer Settings Saved' });
  } else {
    showAlert({ dispatch, alert: 'error' });
  }
  setShowLinearProgress(false);
};

export const getSequencesForPSA = (sequences, setPsaSequences) => {
  const psaSequences = [];
  _.forEach(sequences, (sequence) => {
    if (sequence.isSequenceActive) {
      psaSequences.push({ title: sequence.sequenceName, id: sequence.sequenceName });
    }
  });
  setPsaSequences(psaSequences);
};

export const tabOptions = [
  {
    label: 'Viewer Control',
    icon: <ControlCameraTwoToneIcon />,
    caption: 'Main viewer control settings'
  },
  {
    label: 'Viewer Page',
    icon: <HtmlTwoToneIcon />,
    caption: 'Viewer page settings'
  },
  {
    label: 'Jukebox',
    icon: <LibraryMusicTwoToneIcon />,
    caption: 'Jukebox Viewer Control Mode settings'
  },
  {
    label: 'Voting',
    icon: <HowToVoteTwoToneIcon />,
    caption: 'Voting Viewer Control Mode settings'
  },
  {
    label: 'Interaction Safeguards',
    icon: <LayersTwoToneIcon />,
    caption: 'PSA, viewer location, and other safeguard settings'
  }
];
