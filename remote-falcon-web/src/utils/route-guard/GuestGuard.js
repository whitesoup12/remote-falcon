import { useEffect } from 'react';

import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { CONTROL_PANEL_PATH } from 'config';
import useAuth from 'hooks/useAuth';
import { services } from 'utils/mockAdapter';

import { isExternalViewer } from './helpers/helpers';

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isExternalViewer() && !isLoggedIn) {
      navigate('/remote-falcon', { replace: true });
    }
    if (isLoggedIn) {
      navigate(CONTROL_PANEL_PATH, { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;
