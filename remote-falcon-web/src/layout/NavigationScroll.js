import { useEffect } from 'react';

import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

const NavigationScroll = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return children || null;
};

NavigationScroll.propTypes = {
  children: PropTypes.node
};

export default NavigationScroll;
