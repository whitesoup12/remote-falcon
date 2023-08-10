import { createContext, useEffect } from 'react';

import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import {
  signInService,
  signUpService,
  verifyEmailService,
  resetPasswordService,
  forgotPasswordService,
  verifyPasswordResetLinkService
} from 'services/authentication/authentication.service';
import { coreInfoService } from 'services/controlPanel/accountSettings.service';
import { useDispatch, useSelector } from 'store';
import { startRegisterAction, startLoginAction, startLogoutAction } from 'store/slices/account';
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';
import { services, mockServices } from 'utils/mockAdapter';
import { mixpanelTrack } from 'views/pages/globalPageHelpers';

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
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { ...accountState } = useSelector((state) => state.account);

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          const decoded = jwtDecode(serviceToken);
          let isDemo = false;
          if (decoded['user-data'].email === 'demo@remotefalcon.com') {
            isDemo = true;
            axios.defaults.adapter = mockServices;
          } else {
            services.restore();
          }
          setSession(serviceToken);
          const coreInfoResponse = await coreInfoService();
          const coreInfo = coreInfoResponse.data;
          coreInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          dispatch(
            startLoginAction({
              isDemo,
              coreInfo
            })
          );
        } else {
          dispatch(startLogoutAction());
        }
      } catch (err) {
        console.error(err);
        dispatch(startLogoutAction());
      }
    };

    init();
  }, [dispatch]);

  const login = async (email, password) => {
    if (email === 'demo@remotefalcon.com') {
      axios.defaults.adapter = mockServices;
    } else {
      services.restore();
    }
    const signInResponse = await signInService(email, password);
    const { serviceToken, isDemo } = signInResponse.data;
    const coreInfo = signInResponse.data;
    if (!isDemo) {
      mixpanelTrack('Sign In', coreInfo);
    }
    coreInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setSession(serviceToken);
    dispatch(
      startLoginAction({
        isDemo,
        coreInfo
      })
    );
  };

  const register = async (showName, email, password, firstName, lastName) => {
    services.restore();
    const registerResponse = await signUpService(showName, email, password, firstName, lastName);
    const coreInfo = registerResponse.data;
    mixpanelTrack('Sign Up', coreInfo);
    coreInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    dispatch(
      startRegisterAction({
        coreInfo
      })
    );
    return registerResponse;
  };

  const verifyEmail = async (remoteToken) => {
    services.restore();
    const response = await verifyEmailService(remoteToken);
    return response;
  };

  const sendResetPassword = async (email) => {
    services.restore();
    const response = await forgotPasswordService(email);
    return response;
  };

  const validatePasswordResetLink = async (passwordResetLink) => {
    services.restore();
    const response = await verifyPasswordResetLinkService(passwordResetLink);
    return response;
  };

  const resetPassword = async (serviceToken, password) => {
    services.restore();
    const response = await resetPasswordService(serviceToken, password);
    return response;
  };

  const logout = async () => {
    services.restore();
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
        validatePasswordResetLink,
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
