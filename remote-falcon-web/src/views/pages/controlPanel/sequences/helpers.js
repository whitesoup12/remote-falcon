import _ from 'lodash';

import {
  updateSequenceDetailsService,
  playSequenceService,
  toggleSequenceVisibilityService,
  deleteSequenceService,
  saveSequenceGroupService,
  deleteSequenceGroupService,
  updateSequenceOrderService,
  deleteInactiveSequencesService,
  deleteAllSequencesService
} from 'services/controlPanel/sequences.services';
import { setSequences } from 'store/slices/controlPanel';
import { showAlertOld } from 'views/pages/globalPageHelpers';

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
    sequencesArray.push({ ...sequence });
  });
  _.forEach(sequencesArray, (sequence) => {
    if (sequence.sequenceCategory === '') {
      sequence.sequenceCategory = null;
    }
  });
  const response = await updateSequenceDetailsService(sequencesArray);
  if (response?.status === 200) {
    showAlertOld({ dispatch, message: 'Sequence Details Updated' });
    callback();
  } else {
    showAlertOld({ dispatch, alert: 'error' });
  }
  setShowLinearProgress(false);
};

export const playSequence = async (dispatch, sequenceKey, sequenceName, setShowLinearProgress, show) => {
  setShowLinearProgress(true);
  const response = await playSequenceService(sequenceKey);
  if (response?.status === 200) {
    showAlertOld({ dispatch, message: `${sequenceName} Queued Next` });
  } else if (response?.status === 204) {
    showAlertOld({ dispatch, message: 'You have already requested a sequence', alert: 'warning' });
  } else {
    showAlertOld({ dispatch, alert: 'error' });
  }
  setShowLinearProgress(false);
};

export const toggleSequenceVisibility = async (dispatch, sequenceKey, sequenceName, sequences, setShowLinearProgress, show) => {
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
    showAlertOld({ dispatch, message: `${sequenceName} Visibility Saved` });
  } else {
    showAlertOld({ dispatch, alert: 'error' });
  }
  setShowLinearProgress(false);
};

export const deleteSequence = async ({ dispatch, sequenceKey, sequenceName, setShowLinearProgress, fetchSequences, show }) => {
  setShowLinearProgress(true);
  const response = await deleteSequenceService(sequenceKey);
  if (response?.status === 200) {
    showAlertOld({ dispatch, message: `${sequenceName} Deleted` });
    await fetchSequences();
  } else {
    showAlertOld({ dispatch, alert: 'error' });
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
  show
) => {
  if (newSequenceGroupName == null || newSequenceGroupName === '') {
    setNewSequenceGroupNameError(true);
    return;
  }
  setIsSavingNewSequenceGroup(true);
  try {
    const saveSequenceGroupResponse = await saveSequenceGroupService(newSequenceGroupName);
    if (saveSequenceGroupResponse?.status === 200) {
      showAlertOld({ dispatch, message: `${newSequenceGroupName} Saved` });
      await fetchSequenceGroups();
    } else {
      showAlertOld({ dispatch, alert: 'error' });
    }
  } catch (err) {
    showAlertOld({ dispatch, alert: 'error' });
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
  show
) => {
  setShowLinearProgress(true);
  try {
    const deleteSequenceGroupResponse = await deleteSequenceGroupService(sequenceGroupKey);
    if (deleteSequenceGroupResponse?.status === 200) {
      showAlertOld({ dispatch, message: `${sequenceGroupName} Deleted` });
      await fetchSequenceGroups();
    } else {
      showAlertOld({ dispatch, alert: 'error' });
    }
  } catch (err) {
    showAlertOld({ dispatch, alert: 'error' });
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

export const sortSequencesAlphabetically = async (sequences, setShowLinearProgress, show, dispatch, fetchSequences) => {
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
    showAlertOld({ dispatch, message: 'Sequences Sorted Alphabetically' });
  } else {
    showAlertOld({ dispatch, alert: 'error' });
  }
  fetchSequences();
  setShowLinearProgress(false);
};

export const reorderSequences = async (result, sequences, setShowLinearProgress, show, dispatch, fetchSequences) => {
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
    showAlertOld({ dispatch, message: 'Sequence Order Updated' });
  } else {
    showAlertOld({ dispatch, alert: 'error' });
  }
  fetchSequences();
  setShowLinearProgress(false);
};

export const deleteSequences = async (options, selectedIndex, setShowLinearProgress, dispatch, show, fetchSequences) => {
  if (selectedIndex === 0) {
    setShowLinearProgress(true);
    const response = await deleteInactiveSequencesService();
    if (response?.status === 200) {
      showAlertOld({ dispatch, message: 'All Inactive Sequences Deleted' });
      await fetchSequences();
    } else {
      showAlertOld({ dispatch, alert: 'error' });
    }
    setShowLinearProgress(false);
  } else if (selectedIndex === 1) {
    setShowLinearProgress(true);
    const response = await deleteAllSequencesService();
    if (response?.status === 200) {
      showAlertOld({ dispatch, message: 'All Sequences Deleted' });
      await fetchSequences();
    } else {
      showAlertOld({ dispatch, alert: 'error' });
    }
    setShowLinearProgress(false);
  }
};
