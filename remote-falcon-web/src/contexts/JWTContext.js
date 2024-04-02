import { createContext, useEffect } from 'react';

import { useLazyQuery, useMutation, useApolloClient } from '@apollo/client';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { useDatadogRum } from 'react-datadog';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'store';
import { startLoginAction, startLogoutAction } from 'store/slices/account';
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';
import { showAlert } from 'views/pages/globalPageHelpers';

import { setGraphqlHeaders } from '../index';
import { StatusResponse } from '../utils/enum';
import { signUpQql, verifyEmailQql, signInQql, coreInfoQql, forgotPasswordGql, resetPasswordGql } from '../utils/graphql/account/queries';

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded = jwtDecode(serviceToken);
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    setGraphqlHeaders(serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    setGraphqlHeaders(null);
    delete axios.defaults.headers.common.Authorization;
  }
};

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { ...accountState } = useSelector((state) => state.account);

  const navigate = useNavigate();

  const client = useApolloClient();

  const [signUpMutation] = useMutation(signUpQql);
  const [verifyEmailMutation] = useMutation(verifyEmailQql);
  const [forgotPasswordMutation] = useMutation(forgotPasswordGql);
  const [resetPasswordMutation] = useMutation(resetPasswordGql);

  const [signInQuery] = useLazyQuery(signInQql);
  const [coreInfoQuery] = useLazyQuery(coreInfoQql);

  const datadogRum = useDatadogRum();

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          await coreInfoQuery({
            onCompleted: (data) => {
              const coreInfoData = { ...data?.coreInfo };
              coreInfoData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
              datadogRum.setUser({
                id: coreInfoData?.showName,
                name: `${coreInfoData?.firstName} ${coreInfoData?.lastName}`,
                email: coreInfoData?.email
              });
              dispatch(
                startLoginAction({
                  ...coreInfoData
                })
              );
            },
            onError: () => {
              dispatch(startLogoutAction());
            }
          });
        } else {
          dispatch(startLogoutAction());
        }
      } catch (err) {
        dispatch(startLogoutAction());
      }
    };

    init();
  }, [dispatch]);

  const login = async (email, password) => {
    await signInQuery({
      context: {
        headers: {
          authorization: `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`
        }
      },
      onCompleted: async (data) => {
        setSession(data?.signIn?.serviceToken);
        await coreInfoQuery().then((response) => {
          const coreInfoData = { ...response?.data?.coreInfo };
          coreInfoData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          dispatch(
            startLoginAction({
              ...coreInfoData
            })
          );
        });
        navigate('/control-panel', { replace: true });
      },
      onError: (error) => {
        if (error?.message === StatusResponse.UNAUTHORIZED) {
          showAlert({ dispatch, message: 'Invalid Credentials', alert: 'warning' });
        } else if (error?.message === StatusResponse.SHOW_NOT_FOUND) {
          showAlert({ dispatch, message: 'Show could not be found!', alert: 'error' });
        } else if (error?.message === StatusResponse.EMAIL_NOT_VERIFIED) {
          showAlert({ dispatch, message: 'Email has not been verified', alert: 'warning' });
        } else {
          showAlert({ dispatch, alert: 'error' });
        }
      }
    });
  };

  const register = async (showName, email, password, firstName, lastName) => {
    await signUpMutation({
      variables: {
        showName,
        firstName,
        lastName
      },
      context: {
        headers: {
          authorization: `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`
        }
      },
      onCompleted: () => {
        showAlert({ dispatch, message: `A verification email has been sent to ${email}` });
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 3000);
      },
      onError: (error) => {
        if (error?.message === StatusResponse.SHOW_EXISTS) {
          showAlert({ dispatch, message: 'That email or show name already exists', alert: 'error' });
        } else if (error?.message === StatusResponse.EMAIL_CANNOT_BE_SENT) {
          showAlert({ dispatch, message: 'Unable to send verification email', alert: 'error' });
        } else {
          showAlert({ dispatch, alert: 'error' });
        }
      }
    });
  };

  const verifyEmail = async (showToken) => {
    await verifyEmailMutation({
      variables: {
        showToken
      },
      onCompleted: () => {
        showAlert({ dispatch, message: 'Email successfully verified' });
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 3000);
      },
      onError: () => {
        showAlert({ dispatch, alert: 'error' });
      }
    });
  };

  const sendResetPassword = async (email) => {
    await forgotPasswordMutation({
      variables: {
        email
      },
      onCompleted: () => {
        showAlert({ dispatch, message: `Forgot password email sent to ${email}` });
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 3000);
      },
      onError: (error) => {
        if (error?.message === StatusResponse.UNAUTHORIZED) {
          showAlert({ dispatch, alert: 'error' });
        } else if (error?.message === StatusResponse.EMAIL_CANNOT_BE_SENT) {
          showAlert({ dispatch, message: 'Unable to send password reset email', alert: 'error' });
        } else {
          showAlert({ dispatch, alert: 'error' });
        }
      }
    });
  };

  const resetPassword = async (serviceToken, password) => {
    await resetPasswordMutation({
      context: {
        headers: {
          authorization: `Bearer ${serviceToken}`,
          Password: password
        }
      },
      onCompleted: () => {
        showAlert({ dispatch, message: 'Password Reset' });
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 3000);
      },
      onError: () => {
        showAlert({ dispatch, alert: 'error' });
      }
    });
  };

  const logout = () => {
    client.clearStore();
    setSession(null);
    dispatch(startLogoutAction());
    navigate('/', { replace: true });
  };

  if (accountState.isInitialized !== undefined && !accountState.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider
      value={{
        ...accountState,
        login,
        logout,
        verifyEmail,
        register,
        sendResetPassword,
        resetPassword
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;
