import axios from 'utils/axios';

export const dashboardStatsService = async (timezone, startDateMillis, endDateMillis) => {
  const response = await axios.post('/remotefalcon/api/controlPanel/dashboardStats', {
    timezone,
    startDateMillis,
    endDateMillis
  });
  return response;
};

export const activeViewersService = async () => {
  const response = await axios.get('/remotefalcon/api/controlPanel/activeViewers');
  return response;
};

export const totalViewersService = async (timezone, startDateMillis, endDateMillis) => {
  const response = await axios.post('/remotefalcon/api/controlPanel/totalViewers', {
    timezone,
    startDateMillis,
    endDateMillis
  });
  return response;
};

export const currentRequestsService = async () => {
  const response = await axios.get('/remotefalcon/api/controlPanel/currentRequests');
  return response;
};

export const totalRequestsService = async (timezone, startDateMillis, endDateMillis) => {
  const response = await axios.post('/remotefalcon/api/controlPanel/totalRequests', {
    timezone,
    startDateMillis,
    endDateMillis
  });
  return response;
};

export const downloadStatsToExcelService = async (timezone, startDateMillis, endDateMillis) => {
  const response = await axios.post(
    '/remotefalcon/api/controlPanel/downloadStatsToExcel',
    {
      timezone,
      startDateMillis,
      endDateMillis
    },
    { responseType: 'blob' }
  );
  return response;
};
