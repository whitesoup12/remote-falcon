import React from 'react';

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import PlayArrowTwoToneIcon from '@mui/icons-material/PlayArrowTwoTone';
import ReorderTwoToneIcon from '@mui/icons-material/ReorderTwoTone';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import { IconButton, TableCell, TableRow, Stack, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import Chip from 'ui-component/extended/Chip';

import SequenceDetails from './SequenceDetails';

function SequenceRow({
  provided,
  sequence,
  sequenceGroupOptions,
  handleSequenceGroupChange,
  playSequence,
  toggleSequenceVisibility,
  deleteSequence,
  handleInputChange,
  saveSequenceChanges,
  openCreateNewSequenceGroup,
  openManageSequenceGroups
}) {
  const theme = useTheme();
  const [sequenceDetailsDrawerOpem, setSequenceDetailsDrawerOpem] = React.useState(false);

  const handleSequenceDetailsDrawer = () => {
    setSequenceDetailsDrawerOpem((prevState) => !prevState);
  };

  return (
    <>
      <TableRow ref={provided.innerRef} {...provided.draggableProps} hover>
        <TableCell align="left">
          <div {...provided.dragHandleProps}>
            <ReorderTwoToneIcon />
          </div>
        </TableCell>
        <TableCell onClick={handleSequenceDetailsDrawer} sx={{ minWidth: 60, width: 60, cursor: 'pointer' }}>
          {sequence.isSequenceActive && <Chip label="Active" size="small" variant="outlined" chipcolor="success" />}
          {!sequence.isSequenceActive && <Chip label="Inactive" size="small" variant="outlined" chipcolor="error" />}
        </TableCell>
        <TableCell onClick={handleSequenceDetailsDrawer} sx={{ minWidth: 60, width: 60, cursor: 'pointer' }}>
          {sequence.sequenceType === 'SEQUENCE' && <Chip label="Sequence" size="small" variant="outlined" chipcolor="secondary" />}
          {sequence.sequenceType === 'COMMAND' && <Chip label="Command" size="small" variant="outlined" chipcolor="warning" />}
          {sequence.sequenceType === 'MEDIA' && <Chip label="Media" size="small" variant="outlined" />}
        </TableCell>
        <TableCell onClick={handleSequenceDetailsDrawer} sx={{ maxWidth: 'calc(100vw - 850px)', minWidth: 140, cursor: 'pointer' }}>
          {sequence.sequenceName}
        </TableCell>
        <TableCell onClick={handleSequenceDetailsDrawer} sx={{ maxWidth: 'calc(100vw - 850px)', minWidth: 140, cursor: 'pointer' }}>
          {sequence.sequenceDisplayName}
        </TableCell>
        <TableCell onClick={handleSequenceDetailsDrawer} sx={{ maxWidth: 'calc(100vw - 850px)', minWidth: 140, cursor: 'pointer' }}>
          {sequence.sequenceGroup}
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
                onClick={() => playSequence(sequence.sequenceKey, sequence.sequenceName)}
                disabled={!sequence.isSequenceActive}
              >
                <PlayArrowTwoToneIcon />
              </IconButton>
            </Tooltip>
            <Tooltip placement="top" title="Visibility">
              <IconButton
                color="primary"
                size="small"
                onClick={() => toggleSequenceVisibility(sequence.sequenceKey, sequence.sequenceName)}
                disabled={!sequence.isSequenceActive}
              >
                {sequence.sequenceVisible ? <VisibilityTwoToneIcon /> : <VisibilityOffTwoToneIcon />}
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
                onClick={() => deleteSequence(sequence.sequenceKey, sequence.sequenceName)}
              >
                <DeleteTwoToneIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
      <SequenceDetails
        theme={theme}
        sequence={sequence}
        open={sequenceDetailsDrawerOpem}
        handleDrawerOpen={handleSequenceDetailsDrawer}
        sequenceGroupOptions={sequenceGroupOptions}
        openCreateNewSequenceGroup={openCreateNewSequenceGroup}
        openManageSequenceGroups={openManageSequenceGroups}
        handleInputChange={handleInputChange}
        saveSequenceChanges={saveSequenceChanges}
        handleSequenceGroupChange={handleSequenceGroupChange}
      />
    </>
  );
}

SequenceRow.propTypes = {
  sequence: PropTypes.object,
  sequenceGroupOptions: PropTypes.array,
  handleSequenceGroupChange: PropTypes.func,
  playSequence: PropTypes.func,
  toggleSequenceVisibility: PropTypes.func,
  deleteSequence: PropTypes.func,
  handleInputChange: PropTypes.func,
  saveSequenceChanges: PropTypes.func,
  openCreateNewSequenceGroup: PropTypes.func,
  openManageSequenceGroups: PropTypes.func
};

export default SequenceRow;
