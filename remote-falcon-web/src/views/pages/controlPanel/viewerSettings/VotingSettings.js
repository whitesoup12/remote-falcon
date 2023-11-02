import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import { Grid, CardActions, Divider, Typography, Switch, Stack } from '@mui/material';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

const VotingSettings = ({ remotePrefs, handleSwitchChange }) => (
  <Grid item xs={12}>
    <MainCard content={false}>
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Stack direction="row" spacing={2} pb={1}>
              <Typography variant="h4">Prevent Multiple Votes</Typography>
              <InfoTwoToneIcon
                onClick={() =>
                  window.open(
                    'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#prevent-multiple-votes',
                    '_blank',
                    'noreferrer'
                  )
                }
                fontSize="small"
              />
            </Stack>
            <Typography component="div" variant="caption">
              Prevents a viewer from voting more than once during a voting round.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Switch name="checkIfVoted" color="primary" checked={remotePrefs?.checkIfVoted} onChange={handleSwitchChange} />
          </Grid>
        </Grid>
      </CardActions>
      <Divider />
      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Stack direction="row" spacing={2} pb={1}>
              <Typography variant="h4">Reset Votes After Round</Typography>
              <InfoTwoToneIcon
                onClick={() =>
                  window.open(
                    'https://docs.remotefalcon.com/docs/control-panel/remote-falcon-settings#reset-votes-after-round',
                    '_blank',
                    'noreferrer'
                  )
                }
                fontSize="small"
              />
            </Stack>
            <Typography component="div" variant="caption">
              Resets all sequence votes back to zero after each voting round. Otherwise, votes will persist to the next round.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Switch name="resetVotes" color="primary" checked={remotePrefs?.resetVotes} onChange={handleSwitchChange} />
          </Grid>
        </Grid>
      </CardActions>
      <Divider />
    </MainCard>
  </Grid>
);

VotingSettings.propTypes = {
  remotePrefs: PropTypes.object,
  handleSwitchChange: PropTypes.func
};

export default VotingSettings;
