import React from 'react';

import { useMutation } from '@apollo/client';
import CloseIcon from '@mui/icons-material/Close';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { CardContent, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Stack, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

import { saveSequenceGroupsService } from '../../../../services/mutations.service';
import { useDispatch, useSelector } from '../../../../store';
import { setShow } from '../../../../store/slices/show';
import { UPDATE_SEQUENCE_GROUPS } from '../../../../utils/graphql/mutations';
import { showAlert } from '../../globalPageHelpers';

const ManageSequenceGroups = ({ handleClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.show);

  const [updateSequenceGroupsMutation] = useMutation(UPDATE_SEQUENCE_GROUPS);

  const getSequencesInGroup = (group) => {
    const sequencesInGroup = [];
    _.forEach(show?.sequences, (sequence) => {
      if (sequence?.group === group?.name) {
        sequencesInGroup.push(
          <>
            {sequence?.name}
            <br />
          </>
        );
      }
    });
    return sequencesInGroup;
  };

  const deleteSequenceGroup = (group) => {
    const updatedSequenceGroups = _.cloneDeep([...show?.sequenceGroups]);
    _.remove(updatedSequenceGroups, (updatedGroup) => updatedGroup?.name === group?.name);
    saveSequenceGroupsService(updatedSequenceGroups, updateSequenceGroupsMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            sequenceGroups: [...updatedSequenceGroups]
          })
        );
      }
      showAlert(dispatch, { message: 'Sequence Group Deleted' });
    });
  };

  return (
    <MainCard
      sx={{
        position: 'absolute',
        width: { xs: 450, lg: 800 },
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
      title="Manage Sequence Groups"
      content={false}
      secondary={
        <IconButton onClick={handleClose} size="large">
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      <CardContent>
        <TableContainer>
          <Table sx={{ minWidth: 350 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Sequence Group Name</TableCell>
                <TableCell align="left">Sequences In Group</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="sequences">
              {_.map(show?.sequenceGroups, (group) => (
                <TableRow hover>
                  <TableCell align="left">{group?.name}</TableCell>
                  <TableCell align="left">{getSequencesInGroup(group)}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" alignItems="center">
                      <Tooltip placement="top" title="Delete">
                        <IconButton
                          disabled={getSequencesInGroup(group).length > 0}
                          color="primary"
                          sx={{
                            color: theme.palette.orange.dark,
                            borderColor: theme.palette.orange.main
                          }}
                          size="large"
                          onClick={() => deleteSequenceGroup(group)}
                        >
                          <DeleteTwoToneIcon sx={{ fontSize: '1.5rem' }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </MainCard>
  );
};

ManageSequenceGroups.propTypes = {
  handleClose: PropTypes.func
};

export default ManageSequenceGroups;
