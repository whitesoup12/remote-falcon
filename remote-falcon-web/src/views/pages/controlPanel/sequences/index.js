import { useState, useEffect, useCallback } from 'react';
import * as React from 'react';

import { Box, Grid, TableRow, TableCell, TableContainer, Table, TableHead, TableBody, LinearProgress, Modal, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { sequencesService, sequenceGroupsService } from 'services/controlPanel/sequences.services';
import { useDispatch, useSelector } from 'store';
import { gridSpacing } from 'store/constant';
import { setSequences } from 'store/slices/controlPanel';
import MainCard from 'ui-component/cards/MainCard';
import SequencesSkeleton from 'ui-component/cards/Skeleton/SequencesSkeleton';
import RFLoadingButton from 'ui-component/RFLoadingButton';
import { showAlert } from 'views/pages/globalPageHelpers';

import RFSplitButton from '../../../../ui-component/RFSplitButton';
import CreateNewSequenceGroup from './CreateNewSequenceGroup.modal';
import {
  saveSequenceChanges,
  playSequence,
  toggleSequenceVisibility,
  deleteSequence,
  saveSequenceGroup,
  deleteSequenceGroup,
  handleSequenceGroupChange,
  handleInputChange,
  openCreateNewSequenceGroup,
  openManageSequenceGroups,
  closeCreateNewSequenceGroup,
  handleSequenceGroupNameChange,
  closeManageSequenceGroups,
  sortSequencesAlphabetically,
  reorderSequences,
  deleteSequences
} from './helpers';
import ManageSequenceGroups from './ManageSequenceGroups.modal';
import SequenceRow from './SequenceRow';

const Sequences = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { sequences } = useSelector((state) => state.controlPanel);
  const { coreInfo } = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(0);
  const [showLinearProgress, setShowLinearProgress] = useState(false);
  const [sequenceGroups, setSequenceGroups] = useState([]);
  const [sequenceGroupOptions, setSequenceGroupOptions] = useState([]);
  const [newSequenceGroupName, setNewSequenceGroupName] = useState(null);
  const [newSequenceGroupNameError, setNewSequenceGroupNameError] = useState(false);
  const [isSavingNewSequenceGroup, setIsSavingNewSequenceGroup] = useState(false);
  const [createNewSequenceGroupOpen, setCreateNewSequenceGroupOpen] = useState(false);
  const [manageSequenceGroupsOpen, setManageSequenceGroupsOpen] = useState(false);

  const fetchSequences = useCallback(async () => {
    try {
      const sequencesResponse = await sequencesService();
      const sequences = sequencesResponse.data;
      dispatch(
        setSequences({
          ...sequences
        })
      );
    } catch (err) {
      showAlert({ dispatch, alert: 'error' });
    }
  }, [dispatch]);

  const fetchSequenceGroups = useCallback(async () => {
    try {
      const sequenceGroupsResponse = await sequenceGroupsService();
      const sequenceGroups = sequenceGroupsResponse.data;
      const sequenceGroupOptions = [];
      _.forEach(sequenceGroups, (group) => {
        sequenceGroupOptions.push({ label: group?.sequenceGroupName, id: group?.sequenceGroupName });
      });
      setSequenceGroups(sequenceGroups);
      setSequenceGroupOptions(sequenceGroupOptions);
    } catch (err) {
      showAlert({ dispatch, alert: 'error' });
    }
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchSequences();
      await fetchSequenceGroups();
      setIsLoading(false);
    };

    init();
  }, [dispatch, fetchSequences, fetchSequenceGroups, coreInfo]);

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard title="Sequences" content={false}>
            <Grid item xs={12}>
              {showLinearProgress && <LinearProgress />}
            </Grid>
            {isLoading ? (
              <SequencesSkeleton />
            ) : (
              <TableContainer>
                <Stack direction="row" spacing={2} justifyContent="right" pt={2} pb={2} pr={2}>
                  <RFLoadingButton
                    loading={showLinearProgress}
                    onClick={() =>
                      sortSequencesAlphabetically(sequences, setShowLinearProgress, coreInfo, dispatch, () => fetchSequences())
                    }
                    color="primary"
                  >
                    Sort Alphabetically
                  </RFLoadingButton>
                  <RFSplitButton
                    color="error"
                    onClick={(options, selectedIndex) =>
                      deleteSequences(options, selectedIndex, setShowLinearProgress, dispatch, coreInfo, () => fetchSequences())
                    }
                  />
                </Stack>
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
                  <DragDropContext
                    onDragEnd={(result) =>
                      reorderSequences(result, sequences, setShowLinearProgress, coreInfo, dispatch, () => fetchSequences())
                    }
                  >
                    <Droppable droppableId="sequences">
                      {(provided) => (
                        <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                          <>
                            {_.map(sequences, (sequence, index) => (
                              <Draggable index={parseInt(index, 10)} draggableId={sequence.sequenceName} key={sequence.sequenceName}>
                                {(provided) => (
                                  <SequenceRow
                                    provided={provided}
                                    sequence={sequence}
                                    sequenceGroups={sequenceGroups}
                                    sequenceGroupOptions={sequenceGroupOptions}
                                    handleSequenceGroupChange={(event, value, sequenceKey) =>
                                      handleSequenceGroupChange(
                                        event,
                                        value,
                                        sequenceKey,
                                        dispatch,
                                        sequences,
                                        setShowLinearProgress,
                                        fetchSequences,
                                        fetchSequenceGroups
                                      )
                                    }
                                    playSequence={(sequenceKey, sequenceName) =>
                                      playSequence(dispatch, sequenceKey, sequenceName, setShowLinearProgress, coreInfo)
                                    }
                                    toggleSequenceVisibility={(sequenceKey, sequenceName) =>
                                      toggleSequenceVisibility(
                                        dispatch,
                                        sequenceKey,
                                        sequenceName,
                                        sequences,
                                        setShowLinearProgress,
                                        coreInfo
                                      )
                                    }
                                    deleteSequence={(sequenceKey, sequenceName) =>
                                      deleteSequence({
                                        dispatch,
                                        sequenceKey,
                                        sequenceName,
                                        setShowLinearProgress,
                                        fetchSequences,
                                        coreInfo
                                      })
                                    }
                                    handleInputChange={(event, sequenceKey) => handleInputChange(event, sequenceKey, dispatch, sequences)}
                                    saveSequenceChanges={() =>
                                      saveSequenceChanges(dispatch, sequences, setShowLinearProgress, () => {
                                        fetchSequences();
                                        fetchSequenceGroups();
                                      })
                                    }
                                    openCreateNewSequenceGroup={() =>
                                      openCreateNewSequenceGroup(
                                        setCreateNewSequenceGroupOpen,
                                        setNewSequenceGroupName,
                                        setNewSequenceGroupNameError
                                      )
                                    }
                                    openManageSequenceGroups={() => openManageSequenceGroups(setManageSequenceGroupsOpen)}
                                  />
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
            )}
          </MainCard>
        </Grid>
      </Grid>
      <Modal
        open={createNewSequenceGroupOpen}
        onClose={() => closeCreateNewSequenceGroup(setCreateNewSequenceGroupOpen, setNewSequenceGroupName, setNewSequenceGroupNameError)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <CreateNewSequenceGroup
          handleClose={() =>
            closeCreateNewSequenceGroup(setCreateNewSequenceGroupOpen, setNewSequenceGroupName, setNewSequenceGroupNameError)
          }
          handleSequenceGroupNameChange={(event, hook) => handleSequenceGroupNameChange(event, hook)}
          setNewSequenceGroupName={setNewSequenceGroupName}
          newSequenceGroupNameError={newSequenceGroupNameError}
          createNewSequenceGroup={() =>
            saveSequenceGroup(
              dispatch,
              newSequenceGroupName,
              setIsSavingNewSequenceGroup,
              fetchSequenceGroups,
              setCreateNewSequenceGroupOpen,
              setNewSequenceGroupName,
              setNewSequenceGroupNameError,
              coreInfo
            )
          }
          isSavingNewSequenceGroup={isSavingNewSequenceGroup}
        />
      </Modal>
      <Modal
        open={manageSequenceGroupsOpen}
        onClose={() => closeManageSequenceGroups(setManageSequenceGroupsOpen)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ManageSequenceGroups
          theme={theme}
          handleClose={() => closeManageSequenceGroups(setManageSequenceGroupsOpen)}
          sequenceGroups={sequenceGroups}
          deleteSequenceGroup={(sequenceGroupKey, sequenceGroupName) =>
            deleteSequenceGroup(dispatch, sequenceGroupKey, sequenceGroupName, setShowLinearProgress, fetchSequenceGroups, coreInfo)
          }
        />
      </Modal>
    </Box>
  );
};

export default Sequences;
