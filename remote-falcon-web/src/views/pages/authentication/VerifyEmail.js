import { useEffect, useState } from 'react';

import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';

import useAuth from 'hooks/useAuth';

const VerifyEmail = () => {
  const { verifyEmail } = useAuth();

  const { showToken } = useParams();

  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!emailVerified) {
        await verifyEmail(showToken);

        setEmailVerified(true);
      }
    };

    verify();
  });

  return <Container />;
};

export default VerifyEmail;
