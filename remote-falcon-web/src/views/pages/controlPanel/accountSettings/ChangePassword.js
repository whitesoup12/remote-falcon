import { Grid, Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';

import { gridSpacing } from 'store/constant';
import RFLoadingButton from 'ui-component/RFLoadingButton';

const ChangePassword = ({ changePasswordEnabled, handleInputChange, changePassword, isChangingPassword }) => (
  <Grid container spacing={gridSpacing}>
    <Grid item xs={12} sm={6}>
      <TextField type="password" fullWidth label="Current Password" name="currentPassword" onChange={handleInputChange} />
    </Grid>
    <Grid item xs={12} sm={6} />
    <Grid item xs={12} sm={6}>
      <TextField type="password" fullWidth label="New Password" name="newPassword" onChange={handleInputChange} />
    </Grid>
    <Grid item xs={12} sm={6} />
    <Grid item xs={12} sm={6}>
      <Stack direction="row">
        <RFLoadingButton disabled={!changePasswordEnabled} loading={isChangingPassword} onClick={changePassword} color="primary">
          Change Password
        </RFLoadingButton>
      </Stack>
    </Grid>
  </Grid>
);

ChangePassword.propTypes = {
  changePasswordEnabled: PropTypes.bool,
  handleInputChange: PropTypes.func,
  changePassword: PropTypes.func,
  isChangingPassword: PropTypes.bool
};

export default ChangePassword;
