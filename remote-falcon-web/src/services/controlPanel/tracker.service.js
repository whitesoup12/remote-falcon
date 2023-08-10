import axios from 'utils/axios';

export const fetchWorkItemsService = async () => {
  const response = await axios.get('/remotefalcon/api/controlPanel/getAdoWorkItems');
  return response;
};

export const fetchWorkItemCommentsService = async (workItemId) => {
  const response = await axios.get(`/remotefalcon/api/controlPanel/getAdoWorkItemComments/${workItemId}`);
  return response;
};

export const createWorkItemService = async (workItem) => {
  const requestBody = {
    type: workItem?.type,
    title: workItem?.title,
    description: workItem?.description,
    severity: workItem?.severity
  };
  const response = await axios.post('/remotefalcon/api/controlPanel/createAdoWorkItem', requestBody);
  return response;
};

export const editWorkItemService = async (workItem) => {
  const requestBody = {
    type: workItem?.type,
    title: workItem?.title,
    description: workItem?.description,
    state: workItem?.state,
    severity: workItem?.severity
  };
  const response = await axios.post(`/remotefalcon/api/controlPanel/editAdoWorkItem/${workItem?.id}`, requestBody);
  return response;
};

export const addWorkItemCommentService = async (workItemId, text) => {
  const requestBody = {
    text
  };
  const response = await axios.post(`/remotefalcon/api/controlPanel/addWorkItemComment/${workItemId}`, requestBody);
  return response;
};

export const deleteWorkItemService = async (workItemId) => {
  const response = await axios.delete(`/remotefalcon/api/controlPanel/deleteWorkItem/${workItemId}`);
  return response;
};
