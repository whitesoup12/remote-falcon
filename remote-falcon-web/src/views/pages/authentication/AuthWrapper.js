// material-ui
import { styled } from '@mui/material/styles';

const AuthWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary.light,
  minHeight: '100vh'
}));

export default AuthWrapper;
