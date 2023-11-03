import _ from 'lodash';

import {
  updateSequenceDetailsService,
  playSequenceService,
  toggleSequenceVisibilityService,
  deleteSequenceService,
  saveSequenceGroupService,
  deleteSequenceGroupService,
  updateSequenceOrderService
} from 'services/controlPanel/sequences.services';
import { setSequences } from 'store/slices/controlPanel';
import { showAlert, mixpanelTrack } from 'views/pages/globalPageHelpers';

export const openCreateNewSequenceGroup = (setCreateNewSequenceGroupOpen, setNewSequenceGroupName, setNewSequenceGroupNameError) => {
  setCreateNewSequenceGroupOpen(true);
  setNewSequenceGroupName(null);
  setNewSequenceGroupNameError(false);
};
export const closeCreateNewSequenceGroup = (setCreateNewSequenceGroupOpen, setNewSequenceGroupName, setNewSequenceGroupNameError) => {
  setCreateNewSequenceGroupOpen(false);
  setNewSequenceGroupName(null);
  setNewSequenceGroupNameError(false);
};

export const openManageSequenceGroups = (setManageSequenceGroupsOpen) => {
  setManageSequenceGroupsOpen(true);
};
export const closeManageSequenceGroups = (setManageSequenceGroupsOpen) => {
  setManageSequenceGroupsOpen(false);
};

export const saveSequenceChanges = async (dispatch, sequences, setShowLinearProgress, callback) => {
  setShowLinearProgress(true);
  const sequencesArray = [];
  _.map(sequences, (sequence) => {
    if (sequence.sequenceDisplayName == null || sequence.sequenceDisplayName === '') {
      showAlert({ dispatch, message: 'Sequence Display Name cannot be empty!', alert: 'warning' });
    } else {
      sequencesArray.push({ ...sequence });
    }
  });
  const response = await updateSequenceDetailsService(sequencesArray);
  if (response?.status === 200) {
    showAlert({ dispatch, message: 'Sequence Details Updated' });
    callback();
  } else {
    showAlert({ dispatch, alert: 'error' });
  }
  setShowLinearProgress(false);
};

export const playSequence = async (dispatch, sequenceKey, sequenceName, setShowLinearProgress, coreInfo) => {
  setShowLinearProgress(true);
  const response = await playSequenceService(sequenceKey);
  if (response?.status === 200) {
    showAlert({ dispatch, message: `${sequenceName} Queued Next` });
    mixpanelTrack('Sequence Played', coreInfo);
  } else if (response?.status === 204) {
    showAlert({ dispatch, message: 'You have already requested a sequence', alert: 'warning' });
  } else {
    showAlert({ dispatch, alert: 'error' });
  }
  setShowLinearProgress(false);
};

export const toggleSequenceVisibility = async (dispatch, sequenceKey, sequenceName, sequences, setShowLinearProgress, coreInfo) => {
  setShowLinearProgress(true);
  const response = await toggleSequenceVisibilityService(sequenceKey);
  if (response?.status === 200) {
    const updatedSequences = _.cloneDeep(sequences);
    _.map(updatedSequences, (sequence) => {
      if (sequence.sequenceKey === sequenceKey) {
        sequence.sequenceVisible = !sequence.sequenceVisible;
      }
    });
    dispatch(
      setSequences({
        ...updatedSequences
      })
    );
    showAlert({ dispatch, message: `${sequenceName} Visibility Saved` });
    mixpanelTrack('Sequence Visibility Toggled', coreInfo);
  } else {
    showAlert({ dispatch, alert: 'error' });
  }
  setShowLinearProgress(false);
};

export const deleteSequence = async ({ dispatch, sequenceKey, sequenceName, setShowLinearProgress, fetchSequences, coreInfo }) => {
  setShowLinearProgress(true);
  const response = await deleteSequenceService(sequenceKey);
  if (response?.status === 200) {
    showAlert({ dispatch, message: `${sequenceName} Deleted` });
    mixpanelTrack('Sequence Deleted', coreInfo);
    await fetchSequences();
  } else {
    showAlert({ dispatch, alert: 'error' });
  }
  setShowLinearProgress(false);
};

export const saveSequenceGroup = async (
  dispatch,
  newSequenceGroupName,
  setIsSavingNewSequenceGroup,
  fetchSequenceGroups,
  setCreateNewSequenceGroupOpen,
  setNewSequenceGroupName,
  setNewSequenceGroupNameError,
  coreInfo
) => {
  if (newSequenceGroupName == null || newSequenceGroupName === '') {
    setNewSequenceGroupNameError(true);
    return;
  }
  setIsSavingNewSequenceGroup(true);
  try {
    const saveSequenceGroupResponse = await saveSequenceGroupService(newSequenceGroupName);
    if (saveSequenceGroupResponse?.status === 200) {
      showAlert({ dispatch, message: `${newSequenceGroupName} Saved` });
      mixpanelTrack('Sequence Group Created', coreInfo);
      await fetchSequenceGroups();
    } else {
      showAlert({ dispatch, alert: 'error' });
    }
  } catch (err) {
    showAlert({ dispatch, alert: 'error' });
  }
  closeCreateNewSequenceGroup(setCreateNewSequenceGroupOpen, setNewSequenceGroupName, setNewSequenceGroupNameError);
  setIsSavingNewSequenceGroup(false);
};

export const deleteSequenceGroup = async (
  dispatch,
  sequenceGroupKey,
  sequenceGroupName,
  setShowLinearProgress,
  fetchSequenceGroups,
  coreInfo
) => {
  setShowLinearProgress(true);
  try {
    const deleteSequenceGroupResponse = await deleteSequenceGroupService(sequenceGroupKey);
    if (deleteSequenceGroupResponse?.status === 200) {
      showAlert({ dispatch, message: `${sequenceGroupName} Deleted` });
      mixpanelTrack('Sequence Group Deleted', coreInfo);
      await fetchSequenceGroups();
    } else {
      showAlert({ dispatch, alert: 'error' });
    }
  } catch (err) {
    showAlert({ dispatch, alert: 'error' });
  }
  setShowLinearProgress(false);
};

export const handleSequenceGroupNameChange = (event, hook) => {
  hook(event?.target?.value);
};

export const handleInputChange = (event, sequenceKey, dispatch, sequences) => {
  const updatedSequences = _.cloneDeep(sequences);
  _.map(updatedSequences, (sequence) => {
    if (sequence.sequenceKey === sequenceKey) {
      sequence[event?.target?.name] = event?.target?.value;
    }
  });
  dispatch(
    setSequences({
      ...updatedSequences
    })
  );
};

export const handleSequenceGroupChange = (
  event,
  value,
  sequenceKey,
  dispatch,
  sequences,
  setShowLinearProgress,
  fetchSequences,
  fetchSequenceGroups
) => {
  const updatedSequences = _.cloneDeep(sequences);
  _.map(updatedSequences, (sequence) => {
    if (sequence.sequenceKey === sequenceKey) {
      sequence.sequenceGroup = value?.label ? value.label : null;
    }
  });
  dispatch(
    setSequences({
      ...updatedSequences
    })
  );
  saveSequenceChanges(dispatch, updatedSequences, setShowLinearProgress, () => {
    fetchSequences();
    fetchSequenceGroups();
  });
};

export const sortSequencesAlphabetically = async (sequences, setShowLinearProgress, coreInfo, dispatch, fetchSequences) => {
  setShowLinearProgress(true);
  let updatedSequences = _.cloneDeep(sequences);
  updatedSequences = _.sortBy(updatedSequences, ['sequenceDisplayName']);
  const sequencesArray = [];
  _.map(updatedSequences, (sequence, index) => {
    sequence.sequenceOrder = index;
    sequencesArray.push({ ...sequence });
  });
  const response = await updateSequenceOrderService(sequencesArray);
  if (response?.status === 200) {
    showAlert({ dispatch, message: 'Sequences Sorted Alphabetically' });
    mixpanelTrack('Sequences Sorted Alphabetically', coreInfo);
  } else {
    showAlert({ dispatch, alert: 'error' });
  }
  fetchSequences();
  setShowLinearProgress(false);
};

export const reorderSequences = async (result, sequences, setShowLinearProgress, coreInfo, dispatch, fetchSequences) => {
  if (!result.destination) return;
  const updatedSequences = _.cloneDeep(_.values(sequences));
  const [reorderedItem] = updatedSequences.splice(result.source.index, 1);
  updatedSequences.splice(result.destination.index, 0, reorderedItem);

  const sequencesArray = [];
  _.map(updatedSequences, (sequence, index) => {
    sequence.sequenceOrder = index;
    sequencesArray.push({ ...sequence });
  });

  const response = await updateSequenceOrderService(sequencesArray);
  if (response?.status === 200) {
    showAlert({ dispatch, message: 'Sequence Order Updated' });
    mixpanelTrack('Sequences Sorted Alphabetically', coreInfo);
  } else {
    showAlert({ dispatch, alert: 'error' });
  }
  fetchSequences();
  setShowLinearProgress(false);
};
