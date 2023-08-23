import axios from 'utils/axios';

export const saveUserProfileService = async (userProfile) => {
  const response = await axios.post('/remotefalcon/api/controlPanel/userProfile', {
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    remoteName: userProfile.showName,
    facebookUrl: userProfile.facebookUrl,
    youtubeUrl: userProfile.youtubeUrl
  });
  return response;
};

export const coreInfoService = async () => {
  const response = await axios.get('/remotefalcon/api/controlPanel/coreInfo');
  return response;
};

export const deleteAccountService = async () => {
  const response = await axios.delete('/remotefalcon/api/controlPanel/deleteAccount');
  return response;
};

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

export const requestApiAccessService = async () => {
  const response = await axios.post('/remotefalcon/api/controlPanel/requestApiAccess');
  return response;
};

export const updatePasswordService = async (currentPassword, newPassword) => {
  const response = await axios.post(
    '/remotefalcon/api/controlPanel/updatePassword',
    {},
    {
      headers: { NewPassword: newPassword, Password: currentPassword }
    }
  );
  return response;
};

export const importantAnalyticsService = async () => {
  const response = await axios.post('/remotefalcon/api/controlPanel/importantAnalytics');
  return response;
};
