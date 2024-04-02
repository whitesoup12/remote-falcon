import { useEffect } from 'react';

import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import useAuth from 'hooks/useAuth';
import { services } from 'utils/mockAdapter';

import { isExternalViewer } from './helpers/helpers';

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const ViewerGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isExternalViewer()) {
      navigate('/remote-falcon', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return children;
};

ViewerGuard.propTypes = {
  children: PropTypes.node
};

export default ViewerGuard;
