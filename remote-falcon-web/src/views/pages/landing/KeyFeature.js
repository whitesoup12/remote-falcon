// material-ui
import CodeTwoToneIcon from '@mui/icons-material/CodeTwoTone';
import EmojiEmotionsTwoToneIcon from '@mui/icons-material/EmojiEmotionsTwoTone';
import ExtensionTwoToneIcon from '@mui/icons-material/ExtensionTwoTone';
import MiscellaneousServicesTwoToneIcon from '@mui/icons-material/MiscellaneousServicesTwoTone';
import QueryStatsTwoToneIcon from '@mui/icons-material/QueryStatsTwoTone';
import SupportAgentTwoToneIcon from '@mui/icons-material/SupportAgentTwoTone';
import { Avatar, Button, Container, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';

import FadeInWhenVisible from './Animation';

const KeyFeaturePage = () => {
  const theme = useTheme();
  const avatarIconSx = {
    ...theme.typography.commonAvatar,
    cursor: 'initial',
    width: 72,
    height: 72
  };

  return (
    <Container>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} lg={5} md={10}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item>
                  <Typography variant="h5" color="primary">
                    Key Features
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h2" component="div">
                But wait, there&apos;s more!
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                In case &apos;free&apos; was not enough to presuade you, Remote Falcon has other great features to help make your light show
                interactive.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={gridSpacing}>
            <Grid item lg={4} md={4} xs={12} sm={6}>
              <FadeInWhenVisible>
                <SubCard>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...avatarIconSx,
                          bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark[800] : 'primary.light',
                          color: theme.palette.primary.main
                        }}
                      >
                        <QueryStatsTwoToneIcon />
                      </Avatar>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                      <Typography variant="h5">Stats Dashboard</Typography>
                    </Grid>
                  </Grid>
                </SubCard>
              </FadeInWhenVisible>
            </Grid>
            <Grid item lg={4} md={4} xs={12} sm={6}>
              <FadeInWhenVisible>
                <SubCard>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...avatarIconSx,
                          bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark[900] : 'secondary.light',
                          color: theme.palette.secondary.main
                        }}
                      >
                        <CodeTwoToneIcon />
                      </Avatar>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                      <Typography variant="h5">In-App Viewer Page Editor</Typography>
                    </Grid>
                  </Grid>
                </SubCard>
              </FadeInWhenVisible>
            </Grid>
            <Grid item lg={4} md={4} xs={12} sm={6}>
              <FadeInWhenVisible>
                <SubCard>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...avatarIconSx,
                          bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark[800] : 'primary.light',
                          color: theme.palette.primary.main
                        }}
                      >
                        <EmojiEmotionsTwoToneIcon />
                      </Avatar>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                      <Typography variant="h5">Simple Setup Process</Typography>
                    </Grid>
                  </Grid>
                </SubCard>
              </FadeInWhenVisible>
            </Grid>
            <Grid item lg={4} md={4} xs={12} sm={6}>
              <FadeInWhenVisible>
                <SubCard>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...avatarIconSx,
                          bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark[900] : 'secondary.light',
                          color: theme.palette.secondary.main
                        }}
                      >
                        <ExtensionTwoToneIcon />
                      </Avatar>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                      <Typography variant="h5">FPP and xLights Plugins</Typography>
                    </Grid>
                  </Grid>
                </SubCard>
              </FadeInWhenVisible>
            </Grid>
            <Grid item lg={4} md={4} xs={12} sm={6}>
              <FadeInWhenVisible>
                <SubCard>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...avatarIconSx,
                          bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark[900] : 'secondary.light',
                          color: theme.palette.secondary.main
                        }}
                      >
                        <MiscellaneousServicesTwoToneIcon />
                      </Avatar>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                      <Typography variant="h5">API Access</Typography>
                    </Grid>
                  </Grid>
                </SubCard>
              </FadeInWhenVisible>
            </Grid>
            <Grid item lg={4} md={4} xs={12} sm={6}>
              <FadeInWhenVisible>
                <SubCard>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...avatarIconSx,
                          bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark[800] : 'primary.light',
                          color: theme.palette.primary.main
                        }}
                      >
                        <SupportAgentTwoToneIcon />
                      </Avatar>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                      <Typography variant="h5">Large Support Group</Typography>
                    </Grid>
                  </Grid>
                </SubCard>
              </FadeInWhenVisible>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Grid container justifyContent="center" spacing={gridSpacing}>
            <Grid item>
              <AnimateButton>
                <Button component={RouterLink} to="/signup" size="large" variant="contained" color="secondary">
                  Sign Up
                </Button>
              </AnimateButton>
            </Grid>
            <Grid item>
              <Button component={RouterLink} to="/signin" size="large" variant="text">
                Sign In
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default KeyFeaturePage;
