import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { CONTROL_PANEL_PATH } from 'config';
import Logo from 'ui-component/Logo';

const LogoSection = () => (
  <Link component={RouterLink} to={CONTROL_PANEL_PATH}>
    <Logo />
  </Link>
);

export default LogoSection;
