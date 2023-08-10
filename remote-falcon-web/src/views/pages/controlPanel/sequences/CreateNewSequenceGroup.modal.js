import CloseIcon from '@mui/icons-material/Close';
import { CardContent, CardActions, Grid, Divider, IconButton, TextField } from '@mui/material';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';
import RFLoadingButton from 'ui-component/RFLoadingButton';

const CreateNewSequenceGroup = ({
  handleClose,
  handleSequenceGroupNameChange,
  setNewSequenceGroupName,
  newSequenceGroupNameError,
  createNewSequenceGroup,
  isSavingNewSequenceGroup
}) => (
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
            name="newSequenceGroupName"
            label="Sequence Group Name"
            error={newSequenceGroupNameError}
            onChange={(event) => handleSequenceGroupNameChange(event, setNewSequenceGroupName)}
          />
        </Grid>
        <Grid item xs={12} sm={6} />
        <Grid item xs={12} sm={6} />
      </Grid>
    </CardContent>
    <Divider />
    <CardActions>
      <Grid container justifyContent="flex-end">
        <RFLoadingButton loading={isSavingNewSequenceGroup} onClick={() => createNewSequenceGroup()} color="primary">
          Create Sequence Group
        </RFLoadingButton>
      </Grid>
    </CardActions>
  </MainCard>
);

CreateNewSequenceGroup.propTypes = {
  handleClose: PropTypes.func,
  handleSequenceGroupNameChange: PropTypes.func,
  setNewSequenceGroupName: PropTypes.func,
  newSequenceGroupNameError: PropTypes.bool,
  createNewSequenceGroup: PropTypes.func,
  isSavingNewSequenceGroup: PropTypes.bool
};

export default CreateNewSequenceGroup;
