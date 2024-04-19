import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import CloseIcon from '@mui/icons-material/Close';
import { CardContent, CardActions, Grid, Divider, IconButton, TextField } from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';
import RFLoadingButton from 'ui-component/RFLoadingButton';

import { saveSequenceGroupsService } from '../../../../services/controlPanel/mutations.service';
import { useDispatch, useSelector } from '../../../../store';
import { setShow } from '../../../../store/slices/show';
import { UPDATE_SEQUENCE_GROUPS } from '../../../../utils/graphql/controlPanel/mutations';
import { showAlert } from '../../globalPageHelpers';

const CreateNewSequenceGroup = ({ handleClose }) => {
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.show);

  const [groupName, setGroupName] = useState();
  const [isSaving, setIsSaving] = useState(false);

  const [updateSequenceGroupsMutation] = useMutation(UPDATE_SEQUENCE_GROUPS);

  const saveSequenceGroups = () => {
    setIsSaving(true);
    const updatedSequenceGroups = _.cloneDeep([
      ...show?.sequenceGroups,
      {
        name: groupName,
        votes: 0,
        lastVoteTime: '1999-01-01T00:00:00',
        totalVotes: 0,
        visibilityCount: 0
      }
    ]);
    saveSequenceGroupsService(updatedSequenceGroups, updateSequenceGroupsMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            sequenceGroups: [...updatedSequenceGroups]
          })
        );
      }
      showAlert(dispatch, response?.toast);
      setIsSaving(false);
      handleClose();
    });
  };

  return (
    <MainCard
      sx={{
        position: 'absolute',
        width: { xs: 450, lg: 450 },
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
      title="New Sequence Group"
      content={false}
      secondary={
        <IconButton onClick={handleClose} size="large">
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              type="text"
              fullWidth
              label="Sequence Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e?.target?.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} />
          <Grid item xs={12} sm={6} />
        </Grid>
      </CardContent>
      <Divider />
      <CardActions>
        <Grid container justifyContent="flex-end">
          <RFLoadingButton disabled={!groupName} loading={isSaving} onClick={saveSequenceGroups} color="primary">
            Create Sequence Group
          </RFLoadingButton>
        </Grid>
      </CardActions>
    </MainCard>
  );
};

CreateNewSequenceGroup.propTypes = {
  handleClose: PropTypes.func
};

export default CreateNewSequenceGroup;
