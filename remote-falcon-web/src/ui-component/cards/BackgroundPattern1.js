import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import AuthPatternDark from 'assets/images/auth/auth-pattern-dark.svg';
import AuthPattern from 'assets/images/auth/auth-pattern.svg';

const BackgroundPattern1 = ({ children }) => {
  const theme = useTheme();
  return (
    <Box
      component="span"
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : '#fff',
        backgroundImage: theme.palette.mode === 'dark' ? `url(${AuthPatternDark})` : `url(${AuthPattern})`,
        position: 'absolute',
        backgroundPosition: '0 0',
        overflow: 'hidden',
        m: '0 0 0 auto',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: theme.palette.mode === 'dark' ? 0.85 : 0.9
      }}
    >
      {children}
    </Box>
  );
};

BackgroundPattern1.propTypes = {
  children: PropTypes.node
};

export default BackgroundPattern1;
