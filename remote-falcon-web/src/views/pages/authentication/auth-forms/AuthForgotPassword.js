import { Box, Button, FormControl, FormHelperText, InputLabel, OutlinedInput, Grid, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';

import useAuth from 'hooks/useAuth';
import AnimateButton from 'ui-component/extended/AnimateButton';

const AuthForgotPassword = ({ ...others }) => {
  const theme = useTheme();

  const { sendResetPassword } = useAuth();

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
      })}
      onSubmit={async (values) => {
        await sendResetPassword(values.email);
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-email-forgot">Email Address</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-forgot"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Email Address / Username"
              inputProps={{}}
            />
            {touched.email && errors.email && (
              <FormHelperText error id="standard-weight-helper-text-email-forgot">
                {errors.email}
              </FormHelperText>
            )}
          </FormControl>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            {isSubmitting ? (
              <Grid item xs={12}>
                <Grid item container direction="column" alignItems="center" xs={12}>
                  <CircularProgress color="secondary" />
                </Grid>
              </Grid>
            ) : (
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Send Mail
                </Button>
              </AnimateButton>
            )}
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthForgotPassword;
