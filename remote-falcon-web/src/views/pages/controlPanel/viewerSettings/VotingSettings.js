import { useMutation } from '@apollo/client';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import { Grid, CardActions, Divider, Typography, Switch, Stack } from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

import { savePreferencesService } from '../../../../services/mutations.service';
import { useDispatch, useSelector } from '../../../../store';
import { setShow } from '../../../../store/slices/show';
import { UPDATE_PREFERENCES } from '../../../../utils/graphql/mutations';
import { showAlert } from '../../globalPageHelpers';

const VotingSettings = ({ setShowLinearProgress }) => {
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.show);

  const [updatePreferencesMutation] = useMutation(UPDATE_PREFERENCES);
  const handleCheckIfVotedSwitch = (event, value) => {
    setShowLinearProgress(true);
    const updatedPreferences = _.cloneDeep({
      ...show?.preferences,
      checkIfVoted: value
    });
    savePreferencesService(updatedPreferences, updatePreferencesMutation, (response) => {
      dispatch(
        setShow({
          ...show,
          preferences: {
            ...updatedPreferences
          }
        })
      );
      showAlert(dispatch, response?.toast);
      setShowLinearProgress(false);
    });
  };

  const handleResetVotesSwitch = (event, value) => {
    setShowLinearProgress(true);
    const updatedPreferences = _.cloneDeep({
      ...show?.preferences,
      resetVotes: value
    });
    savePreferencesService(updatedPreferences, updatePreferencesMutation, (response) => {
      dispatch(
        setShow({
          ...show,
          preferences: {
            ...updatedPreferences
          }
        })
      );
      showAlert(dispatch, response?.toast);
      setShowLinearProgress(false);
    });
  };

  return (
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
              <Switch name="checkIfVoted" color="primary" checked={show?.preferences?.checkIfVoted} onChange={handleCheckIfVotedSwitch} />
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
              <Switch name="resetVotes" color="primary" checked={show?.preferences?.resetVotes} onChange={handleResetVotesSwitch} />
            </Grid>
          </Grid>
        </CardActions>
        <Divider />
      </MainCard>
    </Grid>
  );
};

VotingSettings.propTypes = {
  setShowLinearProgress: PropTypes.func
};

export default VotingSettings;
