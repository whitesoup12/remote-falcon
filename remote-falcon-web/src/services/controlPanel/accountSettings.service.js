import axios from 'utils/axios';

export const updateEmailService = async (updatedEmail) => {
  const updatedEmailBase64 = Buffer.from(updatedEmail, 'binary').toString('base64');
  const response = await axios.post(
    '/remotefalcon/api/controlPanel/updateEmail',
    {},
    {
      headers: { Email: updatedEmailBase64 }
    }
  );
  return response;
};

export const importantAnalyticsService = async () => {
  const response = await axios.post('/remotefalcon/api/controlPanel/importantAnalytics');
  return response;
};
