import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import { Grid, TextField, Typography } from '@mui/material';

import { gridSpacing } from 'store/constant';
import Avatar from 'ui-component/extended/Avatar';

const UserProfile = ({ ...otherProps }) => (
  <Grid container spacing={gridSpacing}>
    <Grid item xs={12}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar alt="User 1" src={otherProps.gravatar} sx={{ height: 80, width: 80 }} />
        </Grid>
        <Grid item sm zeroMinWidth>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="caption">
                <ErrorTwoToneIcon sx={{ height: 16, width: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                Image can be changed using{' '}
                <a href="https://en.gravatar.com/" target="_blank" rel="noreferrer">
                  Gravatar
                </a>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="First Name"
        name="firstName"
        value={otherProps.userProfile?.firstName}
        onChange={otherProps.handleInputChange}
        onBlur={otherProps.saveProfile}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Last Name"
        name="lastName"
        defaultValue={otherProps.userProfile?.lastName}
        onChange={otherProps.handleInputChange}
        onBlur={otherProps.saveProfile}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Show Name"
        name="showName"
        defaultValue={otherProps.userProfile?.showName}
        onChange={otherProps.handleInputChange}
        onBlur={otherProps.saveProfile}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField fullWidth disabled label="Email Address" defaultValue={otherProps.userProfile?.email} />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Facebook Show URL"
        name="facebookUrl"
        value={otherProps.userProfile?.facebookUrl}
        onChange={otherProps.handleInputChange}
        onBlur={otherProps.saveProfile}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="YouTube Show URL"
        name="youtubeUrl"
        defaultValue={otherProps.userProfile?.youtubeUrl}
        onChange={otherProps.handleInputChange}
        onBlur={otherProps.saveProfile}
      />
    </Grid>
  </Grid>
);

export default UserProfile;
