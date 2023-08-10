import LoadingButton from '@mui/lab/LoadingButton';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

const RFLoadingButton = ({ disabled, loading, onClick, color, variant, sx, children }) => {
  const theme = useTheme();

  let background = theme.palette.primary.main;
  let backgroundHover = theme.palette.primary.dark;
  if (color === 'error') {
    background = theme.palette.error.main;
    backgroundHover = theme.palette.error.dark;
  }

  return (
    <LoadingButton
      disabled={disabled}
      loading={loading}
      loadingIndicator={<CircularProgress color={color} size={25} />}
      variant={variant || 'contained'}
      size="large"
      sx={sx || { background, '&:hover': { background: backgroundHover } }}
      onClick={onClick}
    >
      {children}
    </LoadingButton>
  );
};

RFLoadingButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.string,
  variant: PropTypes.string,
  sx: PropTypes.object,
  children: PropTypes.node
};

export default RFLoadingButton;
