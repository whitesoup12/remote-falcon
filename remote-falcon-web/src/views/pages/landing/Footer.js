import FacebookIcon from '@mui/icons-material/Facebook';
import { Container, Chip, Grid, Link, Stack, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

import { VERSION } from 'config';
import { gridSpacing } from 'store/constant';
import Logo from 'ui-component/Logo';

const FooterWrapper = styled('div')(({ theme }) => ({
  padding: '35px 0',
  color: '#fff',
  background: theme.palette.secondary.main,
  [theme.breakpoints.down('md')]: {
    textAlign: 'center'
  }
}));

const FooterLink = styled(Link)({
  color: '#fff',
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none !important',
  opacity: '0.8',
  '& svg': {
    fontsize: '1.125rem',
    marginRight: 8
  },
  '&:hover': {
    opacity: '1'
  }
});

const FooterSubWrapper = styled('div')(({ theme }) => ({
  padding: '20px 0',
  color: '#fff',
  background: theme.palette.secondary.dark,
  [theme.breakpoints.down('md')]: {
    textAlign: 'center'
  }
}));

const FooterPage = () => {
  const theme = useTheme();
  return (
    <>
      <FooterWrapper>
        <Container>
          <Grid container alignItems="center" spacing={gridSpacing}>
            <Grid item xs={12} sm={4}>
              <Stack direction="row">
                <Logo />
                <Chip label={VERSION} disabled chipcolor="secondary" size="small" sx={{ cursor: 'pointer', mt: 3, ml: 2 }} />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid
                container
                alignItems="center"
                spacing={2}
                sx={{ justifyContent: 'flex-end', [theme.breakpoints.down('md')]: { justifyContent: 'center' } }}
              >
                <Grid item>
                  <FooterLink href="https://www.facebook.com/groups/remotefalcon" target="_blank" underline="hover">
                    <FacebookIcon />
                    Facebook
                  </FooterLink>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </FooterWrapper>
      <FooterSubWrapper>
        <Container>
          <Typography variant="subtitle2" component="div" color="inherit">
            {'Copyright © '}
            <Link color="inherit" href="https://remotefalcon.com/">
              Remote Falcon
            </Link>{' '}
            {new Date().getFullYear()}.
          </Typography>
        </Container>
      </FooterSubWrapper>
    </>
  );
};

export default FooterPage;
