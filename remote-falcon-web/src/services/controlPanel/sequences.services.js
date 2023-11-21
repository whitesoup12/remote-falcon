import axios from 'utils/axios';

export const sequencesService = async () => {
  const response = await axios.get('/remotefalcon/api/controlPanel/sequences');
  return response;
};

export const playSequenceService = async (sequenceKey) => {
  const response = await axios.post('/remotefalcon/api/controlPanel/playSequence', {
    sequenceKey
  });
  return response;
};

export const toggleSequenceVisibilityService = async (sequenceKey) => {
  const response = await axios.post('/remotefalcon/api/controlPanel/toggleSequenceVisibility', {
    sequenceKey
  });
  return response;
};

export const deleteSequenceService = async (sequenceKey) => {
  const response = await axios.delete(`/remotefalcon/api/controlPanel/deleteSequence/${sequenceKey}`);
  return response;
};

export const updateSequenceDetailsService = async (sequences) => {
  const response = await axios.post('/remotefalcon/api/controlPanel/updateSequenceDetails', sequences);
  return response;
};

export const sequenceGroupsService = async () => {
  const response = await axios.get('/remotefalcon/api/controlPanel/sequenceGroups');
  return response;
};

export const saveSequenceGroupService = async (sequenceGroupName) => {
  const response = await axios.post('/remotefalcon/api/controlPanel/sequenceGroups', {
    sequenceGroupName
  });
  return response;
};

export const deleteSequenceGroupService = async (sequenceGroupKey) => {
  const response = await axios.delete(`/remotefalcon/api/controlPanel/sequenceGroups/${sequenceGroupKey}`);
  return response;
};

export const updateSequenceOrderService = async (sequences) => {
  const response = await axios.post('/remotefalcon/api/controlPanel/updateSequenceOrder', sequences);
  return response;
};

export const deleteInactiveSequencesService = async () => {
  const response = await axios.delete('/remotefalcon/api/controlPanel/deleteInactiveSequences');
  return response;
};

export const deleteAllSequencesService = async () => {
  const response = await axios.delete('/remotefalcon/api/controlPanel/deleteAllSequences');
  return response;
};
