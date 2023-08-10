import MuiAvatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

const Avatar = ({ color, outline, size, sx, ...others }) => {
  const theme = useTheme();

  const colorSX = color && !outline && { color: theme.palette.background.paper, bgcolor: `${color}.main` };
  const outlineSX = outline && {
    color: color ? `${color}.main` : `primary.main`,
    bgcolor: theme.palette.background.paper,
    border: '2px solid',
    borderColor: color ? `${color}.main` : `primary.main`
  };
  let sizeSX = {};
  switch (size) {
    case 'badge':
      sizeSX = {
        width: theme.spacing(3.5),
        height: theme.spacing(3.5)
      };
      break;
    case 'xs':
      sizeSX = {
        width: theme.spacing(4.25),
        height: theme.spacing(4.25)
      };
      break;
    case 'sm':
      sizeSX = {
        width: theme.spacing(5),
        height: theme.spacing(5)
      };
      break;
    case 'lg':
      sizeSX = {
        width: theme.spacing(9),
        height: theme.spacing(9)
      };
      break;
    case 'xl':
      sizeSX = {
        width: theme.spacing(10.25),
        height: theme.spacing(10.25)
      };
      break;
    case 'md':
      sizeSX = {
        width: theme.spacing(7.5),
        height: theme.spacing(7.5)
      };
      break;
    default:
      sizeSX = {};
  }

  return <MuiAvatar sx={{ ...colorSX, ...outlineSX, ...sizeSX, ...sx }} {...others} />;
};

Avatar.propTypes = {
  color: PropTypes.string,
  outline: PropTypes.bool,
  size: PropTypes.string,
  sx: PropTypes.object
};

export default Avatar;
