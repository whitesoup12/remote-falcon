import { useEffect, useState } from 'react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  CircularProgress,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Formik } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { useDispatch } from 'store';
import { unexpectedErrorMessage } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicatorNumFunc } from 'utils/password-strength';

const AuthResetPassword = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const { validatePasswordResetLink, resetPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();
  const [linkValid, setLinkValid] = useState(false);
  const [serviceToken, setServiceToken] = useState();

  const { passwordResetLink } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicatorNumFunc(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    const validateLink = async () => {
      try {
        const response = await validatePasswordResetLink(passwordResetLink);
        if (response?.status === 200) {
          setLinkValid(true);
          setServiceToken(response.data);
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Invalid Password Reset Link',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        } else {
          dispatch(
            openSnackbar({
              open: true,
              message: unexpectedErrorMessage,
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        }
        navigate('/signin', { replace: true });
      }
    };
    validateLink();
  });

  return (
    <Formik
      initialValues={{
        password: '',
        confirmPassword: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string().max(255).required('Password is required'),
        confirmPassword: Yup.string().when('password', {
          is: (val) => !!(val && val.length > 0),
          then: Yup.string().oneOf([Yup.ref('password')], 'Passwords do not match')
        })
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const passwordBase64 = Buffer.from(values.password, 'binary').toString('base64');
          const response = await resetPassword(serviceToken, passwordBase64);
          if (scriptedRef.current) {
            setSubmitting(false);
          }
          if (response?.status === 200) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Password Reset',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: true
              })
            );
            navigate('/signin', { replace: true });
          }
        } catch (err) {
          if (scriptedRef.current) {
            setSubmitting(false);
          }
          dispatch(
            openSnackbar({
              open: true,
              message: unexpectedErrorMessage,
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-password-reset">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-reset"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
              onBlur={handleBlur}
              onChange={(e) => {
                handleChange(e);
                changePassword(e.target.value);
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              inputProps={{}}
            />
          </FormControl>
          {touched.password && errors.password && (
            <FormControl fullWidth>
              <FormHelperText error id="standard-weight-helper-text-reset">
                {errors.password}
              </FormHelperText>
            </FormControl>
          )}
          {strength !== 0 && (
            <FormControl fullWidth>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box
                      style={{ backgroundColor: level?.color }}
                      sx={{
                        width: 85,
                        height: 8,
                        borderRadius: '7px'
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" fontSize="0.75rem">
                      {level?.label}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </FormControl>
          )}

          <FormControl
            fullWidth
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            sx={{ ...theme.typography.customInput }}
          >
            <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-confirm-password"
              type="password"
              value={values.confirmPassword}
              name="confirmPassword"
              label="Confirm Password"
              onBlur={handleBlur}
              onChange={handleChange}
              inputProps={{}}
            />
          </FormControl>

          {touched.confirmPassword && errors.confirmPassword && (
            <FormControl fullWidth>
              <FormHelperText error id="standard-weight-helper-text-confirm-password">
                {' '}
                {errors.confirmPassword}{' '}
              </FormHelperText>
            </FormControl>
          )}

          {errors.submit && (
            <Box
              sx={{
                mt: 3
              }}
            >
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box
            sx={{
              mt: 1
            }}
          >
            {isSubmitting ? (
              <Grid item xs={12}>
                <Grid item container direction="column" alignItems="center" xs={12}>
                  <CircularProgress color="secondary" />
                </Grid>
              </Grid>
            ) : (
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting || !linkValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  Reset Password
                </Button>
              </AnimateButton>
            )}
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthResetPassword;
