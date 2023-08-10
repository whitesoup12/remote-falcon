// material-ui
import { Container, Grid, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import mailImg from 'assets/images/landing/img-contact-mail.svg';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import Accordion from 'ui-component/extended/Accordion';

const HeaderWrapper = styled('div')(({ theme }) => ({
  backgroundSize: '100% 600px',
  backgroundAttachment: 'fixed',
  backgroundRepeat: 'no-repeat',
  textAlign: 'center',
  paddingTop: 30,
  [theme.breakpoints.down('md')]: {
    paddingTop: 0
  }
}));

const basicData = [
  {
    title: 'Where do I find my Remote Token?',
    defaultExpand: false,
    content: 'Your Remote Token can be found under Account Settings -> Account.'
  },
  {
    title: 'Does Remote Falcon have a Facebook group?',
    defaultExpand: false,
    content: (
      <>
        Indeed we do! Here&apos;s the link:&nbsp;
        <a href="https://facebook.com/groups/remotefalcon/" target="_blank" rel="noreferrer">
          Remote Falcon Facebook Group
        </a>
      </>
    )
  },
  {
    title: 'Remote Falcon is amazing! How can I support this free application?',
    defaultExpand: false,
    content: (
      <>
        You can help support Remote Falcon development by making a donation using the &apos;Support Remote Falcon&apos; button in the left
        navbar. Remote Falcon will always be free and donations will never be required in order to use the application.
      </>
    )
  }
];

// ============================|| SAAS PAGES - FAQs ||============================ //

const Faqs = () => {
  const theme = useTheme();

  return (
    <HeaderWrapper>
      <Container>
        <Grid container justifyContent="center" spacing={gridSpacing}>
          <Grid item sm={10} md={7} sx={{ mt: { md: 12.5, xs: 2.5 }, mb: { md: 12.5, xs: 2.5 } }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Typography
                  variant="h1"
                  color="white"
                  component="div"
                  sx={{
                    fontSize: '3.5rem',
                    fontWeight: 900,
                    lineHeight: 1.4,
                    [theme.breakpoints.down('md')]: { fontSize: '1.8125rem', marginTop: '80px' }
                  }}
                >
                  FAQs
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: 400, lineHeight: 1.4, [theme.breakpoints.up('md')]: { my: 0, mx: 12.5 } }}
                  color="white"
                >
                  Quick answers to some Frequently asked questions.
                  <br />
                  <br />
                  For more details, be sure to check out the{' '}
                  <a href="https://github.com/whitesoup12/remote-falcon-tracker/wiki/Remote-Falcon-Wiki" target="_blank" rel="noreferrer">
                    Remote Falcon Wiki
                  </a>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ position: 'relative', display: { xs: 'none', lg: 'block' } }}>
            <img
              src={mailImg}
              alt="Berry"
              style={{
                marginBottom: -0.625,
                position: 'absolute',
                bottom: -90,
                right: '0',
                width: 400,
                maxWidth: '100%',
                animation: '5s wings ease-in-out infinite'
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <MainCard sx={{ textAlign: 'left' }} elevation={4} border={false} boxShadow shadow={4}>
              <Accordion data={basicData} />
            </MainCard>
          </Grid>
        </Grid>
      </Container>
    </HeaderWrapper>
  );
};

export default Faqs;
