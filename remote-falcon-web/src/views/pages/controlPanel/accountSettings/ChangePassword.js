import { useState } from 'react';

import { useMutation } from '@apollo/client';
import { Grid, Stack, TextField } from '@mui/material';

import { gridSpacing } from 'store/constant';
import RFLoadingButton from 'ui-component/RFLoadingButton';

import useAuth from '../../../../hooks/useAuth';
import { updatePasswordService } from '../../../../services/mutations.service';
import { useDispatch } from '../../../../store';
import { UPDATE_PASSWORD } from '../../../../utils/graphql/mutations';
import { showAlert } from '../../globalPageHelpers';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { logout } = useAuth();

  const [isPasswordUpdating, setIsPasswordUpdating] = useState();
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [passwordsFilled, setPasswordsFilled] = useState();

  const [updatePasswordMutation] = useMutation(UPDATE_PASSWORD);

  const verifyPasswordsMatch = () => {
    setPasswordsFilled(currentPassword && newPassword);
  };

  const updatePassword = () => {
    setIsPasswordUpdating(true);
    updatePasswordService(currentPassword, newPassword, updatePasswordMutation, (response) => {
      if (response?.success) {
        setIsPasswordUpdating(false);
        logout();
      } else {
        showAlert(dispatch, response?.toast);
        setIsPasswordUpdating(false);
      }
    });
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} sm={6}>
        <TextField
          type="password"
          fullWidth
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e?.target?.value)}
          onBlur={verifyPasswordsMatch}
        />
      </Grid>
      <Grid item xs={12} sm={6} />
      <Grid item xs={12} sm={6}>
        <TextField
          type="password"
          fullWidth
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e?.target?.value)}
          onBlur={verifyPasswordsMatch}
        />
      </Grid>
      <Grid item xs={12} sm={6} />
      <Grid item xs={12} sm={6}>
        <Stack direction="row">
          <RFLoadingButton disabled={!passwordsFilled} loading={isPasswordUpdating} onClick={updatePassword} color="primary">
            Change Password
          </RFLoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ChangePassword;
