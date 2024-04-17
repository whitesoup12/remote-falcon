import { useState } from 'react';
import * as React from 'react';

import { useMutation } from '@apollo/client';
import { Box, Grid, TableRow, TableCell, TableContainer, Table, TableHead, TableBody, LinearProgress, Stack } from '@mui/material';
import _ from 'lodash';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { useDispatch, useSelector } from 'store';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import RFLoadingButton from 'ui-component/RFLoadingButton';

import { saveSequencesService } from '../../../../services/mutations.service';
import { setShow } from '../../../../store/slices/show';
import RFSplitButton from '../../../../ui-component/RFSplitButton';
import { UPDATE_SEQUENCES } from '../../../../utils/graphql/mutations';
import { showAlert } from '../../globalPageHelpers';
import SequenceRow from './SequenceRow';

const Sequences = () => {
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.show);

  const [showLinearProgress, setShowLinearProgress] = useState(false);

  const [updateSequencesMutation] = useMutation(UPDATE_SEQUENCES);

  const sortSequencesAlphabetically = () => {
    setShowLinearProgress(true);
    let updatedSequences = _.cloneDeep(show?.sequences);
    updatedSequences = _.sortBy(updatedSequences, ['displayName']);
    _.map(updatedSequences, (sequence, index) => {
      sequence.order = index;
    });
    dispatch(
      setShow({
        ...show,
        sequences: [...updatedSequences]
      })
    );
    saveSequencesService(updatedSequences, updateSequencesMutation, (response) => {
      if (response?.success) {
        showAlert(dispatch, { message: 'Sequences Sorted Alphabetically' });
      } else {
        showAlert(dispatch, response?.toast);
      }
      setShowLinearProgress(false);
    });
  };

  const reorderSequences = (result) => {
    if (!result.destination) return;

    const updatedSequences = _.cloneDeep(show?.sequences);
    const [reorderedItem] = updatedSequences.splice(result.source.index, 1);
    updatedSequences.splice(result.destination.index, 0, reorderedItem);
    _.map(updatedSequences, (sequence, index) => {
      sequence.order = index;
    });
    dispatch(
      setShow({
        ...show,
        sequences: [...updatedSequences]
      })
    );
    saveSequencesService(updatedSequences, updateSequencesMutation, (response) => {
      if (response?.success) {
        showAlert(dispatch, { message: 'Sequences Order Updated' });
      } else {
        showAlert(dispatch, response?.toast);
      }
      setShowLinearProgress(false);
    });
  };

  const deleteSequences = async (options, selectedIndex) => {
    if (selectedIndex === 0) {
      setShowLinearProgress(true);
      const updatedSequences = _.cloneDeep([...show?.sequences]);
      _.remove(updatedSequences, (updatedSequence) => !updatedSequence?.active);
      saveSequencesService(updatedSequences, updateSequencesMutation, (response) => {
        if (response?.success) {
          dispatch(
            setShow({
              ...show,
              sequences: [...updatedSequences]
            })
          );
          showAlert(dispatch, { message: 'Inactive Sequences Deleted' });
        } else {
          showAlert(dispatch, response?.toast);
        }
        setShowLinearProgress(false);
      });
    } else if (selectedIndex === 1) {
      setShowLinearProgress(true);
      const updatedSequences = _.cloneDeep([]);
      saveSequencesService(updatedSequences, updateSequencesMutation, (response) => {
        if (response?.success) {
          dispatch(
            setShow({
              ...show,
              sequences: [...updatedSequences]
            })
          );
          showAlert(dispatch, { message: 'All Sequences Deleted' });
        } else {
          showAlert(dispatch, response?.toast);
        }
        setShowLinearProgress(false);
      });
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard title="Sequences" content={false}>
            <Grid item xs={12}>
              {showLinearProgress && <LinearProgress />}
            </Grid>
            <>
              <Stack direction="row" spacing={2} justifyContent="right" pt={2} pb={2} pr={2}>
                <RFLoadingButton loading={showLinearProgress} onClick={sortSequencesAlphabetically} color="primary">
                  Sort Alphabetically
                </RFLoadingButton>
                <RFSplitButton color="error" onClick={(options, selectedIndex) => deleteSequences(options, selectedIndex)} />
              </Stack>
              <TableContainer>
                <Table size="small" aria-label="collapsible table">
                  <TableHead sx={{ '& th,& td': { whiteSpace: 'nowrap' } }}>
                    <TableRow>
                      <TableCell sx={{ pl: 3 }} />
                      <TableCell sx={{ pl: 3 }}>Status</TableCell>
                      <TableCell sx={{ pl: 3 }}>Type</TableCell>
                      <TableCell sx={{ pl: 3 }} align="center">
                        Sequence Key
                      </TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Display Name</TableCell>
                      <TableCell>Artist</TableCell>
                      <TableCell>Group</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell sx={{ pl: 3 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <DragDropContext onDragEnd={(result) => reorderSequences(result)}>
                    <Droppable droppableId="sequences">
                      {(provided) => (
                        <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                          <>
                            {_.map(show?.sequences, (sequence, index) => (
                              <Draggable index={parseInt(index, 10)} draggableId={sequence.name} key={sequence.name}>
                                {(provided) => (
                                  <SequenceRow provided={provided} sequence={sequence} setShowLinearProgress={setShowLinearProgress} />
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </>
                        </TableBody>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Table>
              </TableContainer>
            </>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Sequences;
