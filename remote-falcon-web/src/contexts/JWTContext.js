import { createContext, useEffect } from 'react';

import { useLazyQuery, useMutation, useApolloClient } from '@apollo/client';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { useDatadogRum } from 'react-datadog';
import { useNavigate } from 'react-router-dom';

import { setGraphqlHeaders } from 'index';
import { useDispatch, useSelector } from 'store';
import { startLoginAction, startLogoutAction } from 'store/slices/show';
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';
import { StatusResponse } from 'utils/enum';
import { SIGN_UP, VERIFY_EMAIL, FORGOT_PASSWORD, RESET_PASSWORD } from 'utils/graphql/mutations';
import { SIGN_IN, GET_SHOW } from 'utils/graphql/queries';
import { showAlertOld } from 'views/pages/globalPageHelpers';

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
  const { ...showState } = useSelector((state) => state.show);

  const navigate = useNavigate();

  const client = useApolloClient();

  const [signUpMutation] = useMutation(SIGN_UP);
  const [verifyEmailMutation] = useMutation(VERIFY_EMAIL);
  const [forgotPasswordMutation] = useMutation(FORGOT_PASSWORD);
  const [resetPasswordMutation] = useMutation(RESET_PASSWORD);

  const [signInQuery] = useLazyQuery(SIGN_IN);
  const [getShowQuery] = useLazyQuery(GET_SHOW);

  const datadogRum = useDatadogRum();

  const logout = () => {
    client.clearStore();
    setSession(null);
    dispatch(startLogoutAction());
    navigate('/', { replace: true });
  };

  useEffect(() => {
    const init = () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          getShowQuery({
            onCompleted: (data) => {
              const showData = { ...data?.getShow };
              showData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
              datadogRum.setUser({
                id: showData?.showName,
                name: `${showData?.userProfile?.firstName} ${showData?.userProfile?.lastName}`,
                email: showData?.email
              });
              dispatch(
                startLoginAction({
                  ...showData
                })
              );
            },
            onError: () => {
              logout();
            }
          });
        } else {
          logout();
        }
      } catch (err) {
        logout();
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
      onCompleted: (data) => {
        setSession(data?.signIn?.serviceToken);
        getShowQuery({
          onCompleted: (data) => {
            const showData = { ...data?.getShow };
            showData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            dispatch(
              startLoginAction({
                ...showData
              })
            );
          }
        });
      },
      onError: (error) => {
        if (error?.message === StatusResponse.UNAUTHORIZED) {
          showAlertOld({ dispatch, message: 'Invalid Credentials', alert: 'warning' });
        } else if (error?.message === StatusResponse.SHOW_NOT_FOUND) {
          showAlertOld({ dispatch, message: 'Show could not be found!', alert: 'error' });
        } else if (error?.message === StatusResponse.EMAIL_NOT_VERIFIED) {
          showAlertOld({ dispatch, message: 'Email has not been verified', alert: 'warning' });
        } else {
          showAlertOld({ dispatch, alert: 'error' });
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
        showAlertOld({ dispatch, message: `A verification email has been sent to ${email}` });
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 3000);
      },
      onError: (error) => {
        if (error?.message === StatusResponse.SHOW_EXISTS) {
          showAlertOld({ dispatch, message: 'That email or show name already exists', alert: 'error' });
        } else if (error?.message === StatusResponse.EMAIL_CANNOT_BE_SENT) {
          showAlertOld({ dispatch, message: 'Unable to send verification email', alert: 'error' });
        } else {
          showAlertOld({ dispatch, alert: 'error' });
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
        showAlertOld({ dispatch, message: 'Email successfully verified' });
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 3000);
      },
      onError: () => {
        showAlertOld({ dispatch, alert: 'error' });
      }
    });
  };

  const sendResetPassword = async (email) => {
    await forgotPasswordMutation({
      variables: {
        email
      },
      onCompleted: () => {
        showAlertOld({ dispatch, message: `Forgot password email sent to ${email}` });
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 3000);
      },
      onError: (error) => {
        if (error?.message === StatusResponse.UNAUTHORIZED) {
          showAlertOld({ dispatch, alert: 'error' });
        } else if (error?.message === StatusResponse.EMAIL_CANNOT_BE_SENT) {
          showAlertOld({ dispatch, message: 'Unable to send password reset email', alert: 'error' });
        } else {
          showAlertOld({ dispatch, alert: 'error' });
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
        showAlertOld({ dispatch, message: 'Password Reset' });
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 3000);
      },
      onError: () => {
        showAlertOld({ dispatch, alert: 'error' });
      }
    });
  };

  if (showState.isInitialized !== undefined && !showState.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider
      value={{
        ...showState,
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
