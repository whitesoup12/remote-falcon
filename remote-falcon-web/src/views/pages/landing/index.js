import { useEffect } from 'react';

import { styled } from '@mui/material/styles';
import mixpanel from 'mixpanel-browser';

import AppBar from 'ui-component/extended/AppBar';

import Feature from './Feature';
import Footer from './Footer';
import Header from './Header';
import KeyFeature from './KeyFeature';

const HeaderWrapper = styled('div')(({ theme }) => ({
  paddingTop: 30,
  overflowX: 'hidden',
  overflowY: 'clip',
  [theme.breakpoints.down('md')]: {
    paddingTop: 42
  }
}));

const SecondWrapper = styled('div')(({ theme }) => ({
  paddingTop: 160,
  [theme.breakpoints.down('md')]: {
    paddingTop: 60
  }
}));

const Landing = () => {
  useEffect(() => {
    mixpanel.track('Landing Page View');
  }, []);

  return (
    <>
      <HeaderWrapper id="home">
        <AppBar />
        <Header />
      </HeaderWrapper>
      <SecondWrapper>
        <Feature />
      </SecondWrapper>
      <SecondWrapper>
        <KeyFeature />
      </SecondWrapper>
      <SecondWrapper />
      <Footer />
    </>
  );
};

export default Landing;
