import { useEffect, useState } from 'react';

import { Container } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import useAuth from 'hooks/useAuth';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const VerifyEmail = () => {
  const { verifyEmail } = useAuth();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { remoteToken } = useParams();

  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!emailVerified) {
        try {
          const response = await verifyEmail(remoteToken);
          if (response?.status === 200) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Email Verified',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: true
              })
            );
          }
          navigate('/signin', { replace: true });
        } catch (err) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Unexpected Error',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        }

        setEmailVerified(true);
      }
    };

    verify();
  });

  return <Container />;
};

export default VerifyEmail;
