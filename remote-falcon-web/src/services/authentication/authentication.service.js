import axios from 'utils/axios';

export const forgotPasswordService = async (email) => {
  const response = await axios.post('/remotefalcon/api/account/forgotPassword', { email });
  return response;
};

export const resetPasswordService = async (serviceToken, password) => {
  const response = await axios.post(
    '/remotefalcon/api/account/resetPassword',
    {},
    {
      headers: { Authorization: `Bearer ${serviceToken}`, Password: password }
    }
  );
  return response;
};

export const signInService = async (email, password) => {
  const response = await axios.post(
    '/remotefalcon/api/account/signIn',
    {},
    {
      auth: {
        username: email,
        password
      }
    }
  );
  return response;
};

export const signUpService = async (showName, email, password, firstName, lastName) => {
  const response = await axios.post(
    '/remotefalcon/api/account/signUp',
    {
      showName,
      firstName,
      lastName
    },
    {
      auth: {
        username: email,
        password
      }
    }
  );
  return response;
};

export const verifyEmailService = async (showToken) => {
  const response = await axios.post('/remotefalcon/api/account/verifyEmail', {
    showToken
  });
  return response;
};

export const verifyPasswordResetLinkService = async (passwordResetLink) => {
  const response = await axios.post('/remotefalcon/api/account/verifyResetPasswordLink', {
    passwordResetLink
  });
  return response;
};
