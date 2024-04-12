import axios from 'utils/axios';

// eslint-disable-next-line import/prefer-default-export
export const downloadStatsToExcelService = async (timezone) => {
  const response = await axios.post(
    '/remotefalcon/api/controlPanel/downloadStatsToExcel',
    {
      timezone
    },
    { responseType: 'blob' }
  );
  return response;
};
