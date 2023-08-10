// material-ui
import HtmlTwoToneIcon from '@mui/icons-material/HtmlTwoTone';
import LibraryMusicTwoToneIcon from '@mui/icons-material/LibraryMusicTwoTone';
import SavingsTwoToneIcon from '@mui/icons-material/SavingsTwoTone';
import { Container, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';
import Avatar from 'ui-component/extended/Avatar';

import FadeInWhenVisible from './Animation';

const FeaturePage = () => {
  const theme = useTheme();
  return (
    <Container>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} lg={5} md={10}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item>
                  <Typography variant="h5" color="primary">
                    Top Features
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h2" component="div">
                What is Remote Falcon?
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                Remote Falcon brings a unique way to allow your viewers to interact with your light show.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={gridSpacing} sx={{ textAlign: 'center' }}>
            <Grid item md={4} sm={6}>
              <FadeInWhenVisible>
                <SubCard>
                  <Grid container justifyContent="center" spacing={2}>
                    <Grid item>
                      <Avatar
                        size="xl"
                        variant="rounded"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark[900] : theme.palette.primary.light,
                          color: theme.palette.primary.main
                        }}
                      >
                        <LibraryMusicTwoToneIcon fontSize="large" />
                      </Avatar>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h3">Request Sequences</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        Viewers can request sequences from your show through Jukebox Queue or Voting methods.
                      </Typography>
                    </Grid>
                  </Grid>
                </SubCard>
              </FadeInWhenVisible>
            </Grid>
            <Grid item md={4} sm={6}>
              <FadeInWhenVisible>
                <SubCard>
                  <Grid container justifyContent="center" spacing={2}>
                    <Grid item>
                      <Avatar
                        size="xl"
                        variant="rounded"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark[900] : theme.palette.secondary.light,
                          color: theme.palette.secondary.main
                        }}
                      >
                        <HtmlTwoToneIcon fontSize="large" />
                      </Avatar>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h3">Custom Viewer Page</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        Create your own custom viewer page on your own light show domain created by Remote Falcon.
                      </Typography>
                    </Grid>
                  </Grid>
                </SubCard>
              </FadeInWhenVisible>
            </Grid>
            <Grid item md={4} sm={6}>
              <FadeInWhenVisible>
                <SubCard>
                  <Grid container justifyContent="center" spacing={2}>
                    <Grid item>
                      <Avatar
                        size="xl"
                        variant="rounded"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark[900] : theme.palette.success.light,
                          color: theme.palette.success.dark
                        }}
                      >
                        <SavingsTwoToneIcon fontSize="large" />
                      </Avatar>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h3">Totally Free</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">The best feature in Remote Falcon is that it is 100% free to use!</Typography>
                    </Grid>
                  </Grid>
                </SubCard>
              </FadeInWhenVisible>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FeaturePage;
