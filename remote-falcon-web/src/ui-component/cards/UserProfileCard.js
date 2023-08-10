import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Button, Card, CardContent, CardMedia, Chip, Grid, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { gridSpacing } from 'store/constant';

import Avatar from '../extended/Avatar';

const avatarImage = require.context('assets/images/profile', true);

const FacebookWrapper = styled(Button)({
  padding: 8,
  background: 'rgba(66, 103, 178, 0.2)',
  '& svg': {
    color: '#4267B2'
  },
  '&:hover': {
    background: '#4267B2',
    '& svg': {
      color: '#fff'
    }
  }
});

const TwitterWrapper = styled(Button)({
  padding: 8,
  background: 'rgba(29, 161, 242, 0.2)',
  '& svg': {
    color: '#1DA1F2'
  },
  '&:hover': {
    background: '#1DA1F2',
    '& svg': {
      color: '#fff'
    }
  }
});

const LinkedInWrapper = styled(Button)({
  padding: 8,
  background: 'rgba(14, 118, 168, 0.12)',
  '& svg': {
    color: '#0E76A8'
  },
  '&:hover': {
    background: '#0E76A8',
    '& svg': {
      color: '#fff'
    }
  }
});

// ==============================|| USER PROFILE CARD ||============================== //

const UserProfileCard = ({ avatar, name, profile, role, status }) => {
  const theme = useTheme();
  const avatarProfile = avatar && avatarImage(`./${avatar}`).default;
  const imageProfile = profile && avatarImage(`./${profile}`).default;

  return (
    <Card
      sx={{
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
        border: theme.palette.mode === 'dark' ? 'none' : '1px solid',
        borderColor: theme.palette.grey[100],
        textAlign: 'center'
      }}
    >
      <CardMedia component="img" image={imageProfile} title="Slider5 image" sx={{ height: '125px' }} />
      <CardContent sx={{ p: 2, pb: '16px !important' }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Avatar alt={name} src={avatarProfile} sx={{ width: 72, height: 72, m: '-50px auto 0' }} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} alignItems="center">
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h4">{name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">{role}</Typography>
              </Grid>
              <Grid item xs={12}>
                {status === 'Active' ? (
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : 'success.light',
                      color: 'success.dark'
                    }}
                  />
                ) : (
                  <Chip
                    label="Rejected"
                    size="small"
                    sx={{
                      bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : 'error.light',
                      color: 'error.dark'
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FacebookWrapper fullWidth>
                  <FacebookIcon />
                </FacebookWrapper>
              </Grid>
              <Grid item xs={4}>
                <TwitterWrapper fullWidth>
                  <TwitterIcon />
                </TwitterWrapper>
              </Grid>
              <Grid item xs={4}>
                <LinkedInWrapper fullWidth>
                  <LinkedInIcon />
                </LinkedInWrapper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" fullWidth startIcon={<ChatBubbleTwoToneIcon />}>
              Message
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

UserProfileCard.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  profile: PropTypes.string,
  role: PropTypes.string,
  status: PropTypes.string
};

export default UserProfileCard;
