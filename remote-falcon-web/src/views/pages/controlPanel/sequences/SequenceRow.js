import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import PlayArrowTwoToneIcon from '@mui/icons-material/PlayArrowTwoTone';
import ReorderTwoToneIcon from '@mui/icons-material/ReorderTwoTone';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import { IconButton, TableCell, TableRow, Stack, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';

import Chip from 'ui-component/extended/Chip';

import { playSequenceFromControlPanelService, saveSequencesService } from '../../../../services/mutations.service';
import { useDispatch, useSelector } from '../../../../store';
import { setShow } from '../../../../store/slices/show';
import { PLAY_SEQUENCE_FROM_CONTROL_PANEL, UPDATE_SEQUENCES } from '../../../../utils/graphql/mutations';
import { showAlert } from '../../globalPageHelpers';
import SequenceDetails from './SequenceDetails';

function SequenceRow({ provided, sequence, setShowLinearProgress }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.show);

  const [sequenceDetailsDrawerOpen, setSequenceDetailsDrawerOpen] = useState(false);

  const [updateSequencesMutation] = useMutation(UPDATE_SEQUENCES);
  const [playSequenceFromControlPanelMutation] = useMutation(PLAY_SEQUENCE_FROM_CONTROL_PANEL);

  const playSequence = () => {
    setShowLinearProgress(true);
    playSequenceFromControlPanelService(sequence, playSequenceFromControlPanelMutation, (response) => {
      showAlert(dispatch, response?.toast);
      setShowLinearProgress(false);
    });
  };

  const toggleSequenceVisibility = () => {
    setShowLinearProgress(true);
    const updatedSequences = _.cloneDeep([...show?.sequences]);
    _.forEach(updatedSequences, (updatedSequence) => {
      if (updatedSequence?.key === sequence?.key) {
        updatedSequence.visible = !updatedSequence.visible;
      }
    });
    saveSequencesService(updatedSequences, updateSequencesMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            sequences: [...updatedSequences]
          })
        );
        showAlert(dispatch, { message: `${sequence?.name} Visibility Updated` });
      } else {
        showAlert(dispatch, response?.toast);
      }
      setShowLinearProgress(false);
    });
  };

  const deleteSequence = () => {
    setShowLinearProgress(true);
    const updatedSequences = _.cloneDeep([...show?.sequences]);
    _.remove(updatedSequences, (updatedSequence) => updatedSequence?.key === sequence?.key);
    saveSequencesService(updatedSequences, updateSequencesMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            sequences: [...updatedSequences]
          })
        );
        showAlert(dispatch, { message: `${sequence?.name} Deleted` });
      } else {
        showAlert(dispatch, response?.toast);
      }
      setShowLinearProgress(false);
    });
  };

  return (
    <>
      <TableRow ref={provided.innerRef} {...provided.draggableProps} hover>
        <TableCell align="left">
          <div {...provided.dragHandleProps}>
            <ReorderTwoToneIcon />
          </div>
        </TableCell>
        <TableCell
          onClick={() => setSequenceDetailsDrawerOpen(!sequenceDetailsDrawerOpen)}
          sx={{ minWidth: 60, width: 60, cursor: 'pointer' }}
        >
          {sequence.active && <Chip label="Active" size="small" variant="outlined" chipcolor="success" />}
          {!sequence.active && <Chip label="Inactive" size="small" variant="outlined" chipcolor="error" />}
        </TableCell>
        <TableCell
          onClick={() => setSequenceDetailsDrawerOpen(!sequenceDetailsDrawerOpen)}
          sx={{ minWidth: 60, width: 60, cursor: 'pointer' }}
        >
          {sequence.type === 'SEQUENCE' && <Chip label="Sequence" size="small" variant="outlined" chipcolor="secondary" />}
          {sequence.type === 'COMMAND' && <Chip label="Command" size="small" variant="outlined" chipcolor="warning" />}
          {sequence.type === 'MEDIA' && <Chip label="Media" size="small" variant="outlined" />}
        </TableCell>
        <TableCell
          onClick={() => setSequenceDetailsDrawerOpen(!sequenceDetailsDrawerOpen)}
          sx={{ maxWidth: 'calc(100vw - 850px)', minWidth: 140, cursor: 'pointer' }}
          align="center"
        >
          {sequence.key}
        </TableCell>
        <TableCell
          onClick={() => setSequenceDetailsDrawerOpen(!sequenceDetailsDrawerOpen)}
          sx={{ maxWidth: 'calc(100vw - 850px)', minWidth: 140, cursor: 'pointer' }}
        >
          {sequence.name}
        </TableCell>
        <TableCell
          onClick={() => setSequenceDetailsDrawerOpen(!sequenceDetailsDrawerOpen)}
          sx={{ maxWidth: 'calc(100vw - 850px)', minWidth: 140, cursor: 'pointer' }}
        >
          {sequence.displayName}
        </TableCell>
        <TableCell
          onClick={() => setSequenceDetailsDrawerOpen(!sequenceDetailsDrawerOpen)}
          sx={{ maxWidth: 'calc(100vw - 850px)', minWidth: 140, cursor: 'pointer' }}
        >
          {sequence.artist}
        </TableCell>
        <TableCell
          onClick={() => setSequenceDetailsDrawerOpen(!sequenceDetailsDrawerOpen)}
          sx={{ maxWidth: 'calc(100vw - 850px)', minWidth: 140, cursor: 'pointer' }}
        >
          {sequence.group}
        </TableCell>
        <TableCell
          onClick={() => setSequenceDetailsDrawerOpen(!sequenceDetailsDrawerOpen)}
          sx={{ maxWidth: 'calc(100vw - 850px)', minWidth: 140, cursor: 'pointer' }}
        >
          {sequence.category}
        </TableCell>
        <TableCell sx={{ minWidth: 60, width: 60 }}>
          <Stack direction="row" spacing={0.25} alignItems="center">
            <Tooltip placement="top" title="Play">
              <IconButton
                color="primary"
                sx={{
                  color: theme.palette.green.dark,
                  borderColor: theme.palette.green.main
                }}
                size="small"
                onClick={playSequence}
                disabled={!sequence.active}
              >
                <PlayArrowTwoToneIcon />
              </IconButton>
            </Tooltip>
            <Tooltip placement="top" title="Visibility">
              <IconButton color="primary" size="small" onClick={toggleSequenceVisibility} disabled={!sequence.active}>
                {sequence.visible ? <VisibilityTwoToneIcon /> : <VisibilityOffTwoToneIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip placement="top" title="Delete">
              <IconButton
                color="primary"
                sx={{
                  color: theme.palette.orange.dark,
                  borderColor: theme.palette.orange.main
                }}
                size="small"
                onClick={deleteSequence}
              >
                <DeleteTwoToneIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
      <SequenceDetails
        setShowLinearProgress={setShowLinearProgress}
        sequence={sequence}
        open={sequenceDetailsDrawerOpen}
        handleDrawerOpen={() => setSequenceDetailsDrawerOpen(!sequenceDetailsDrawerOpen)}
      />
    </>
  );
}

SequenceRow.propTypes = {
  provided: PropTypes.object,
  sequence: PropTypes.object,
  setShowLinearProgress: PropTypes.func
};

export default SequenceRow;
