import React, { useCallback, useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import { Box, Button, Divider, Drawer, Grid, Typography, Tooltip, IconButton, Stack, TextField, Autocomplete, Modal } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { saveSequencesService } from '../../../../services/mutations.service';
import { useDispatch, useSelector } from '../../../../store';
import { setShow } from '../../../../store/slices/show';
import { UPDATE_SEQUENCES } from '../../../../utils/graphql/mutations';
import { showAlert } from '../../globalPageHelpers';
import CreateNewSequenceGroup from './CreateNewSequenceGroup.modal';
import ManageSequenceGroups from './ManageSequenceGroups.modal';

const SequenceDetails = ({ setShowLinearProgress, sequence, open, handleDrawerOpen }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.show);

  const [createNewSequenceGroupOpen, setCreateNewSequenceGroupOpen] = useState(false);
  const [manageSequenceGroupsOpen, setManageSequenceGroupsOpen] = useState(false);

  const [sequenceGroupOptions, setSequenceGroupOptions] = useState([]);
  const [displayName, setDisplayName] = useState(sequence?.displayName);
  const [artist, setArtist] = useState(sequence?.artist);
  const [imageUrl, setImageUrl] = useState(sequence?.imageUrl);
  const [category, setCategory] = useState(sequence?.category);

  const [updateSequencesMutation] = useMutation(UPDATE_SEQUENCES);

  const getSelectedSequenceGroup = () => {
    let selectedSequenceGroup = null;
    _.forEach(sequenceGroupOptions, (option) => {
      if (option.label === sequence?.group) {
        selectedSequenceGroup = option;
      }
    });
    return selectedSequenceGroup;
  };

  const saveSequences = () => {
    setShowLinearProgress(true);
    const updatedSequences = _.cloneDeep([...show?.sequences]);
    _.forEach(updatedSequences, (updatedSequence) => {
      if (updatedSequence?.key === sequence?.key) {
        updatedSequence.displayName = displayName;
        updatedSequence.artist = artist;
        updatedSequence.imageUrl = imageUrl;
        updatedSequence.category = category;
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
      }
      showAlert(dispatch, response?.toast);
      setShowLinearProgress(false);
    });
  };

  const handleSequenceGroupChange = (event, value) => {
    setShowLinearProgress(true);
    const updatedSequences = _.cloneDeep([...show?.sequences]);
    _.forEach(updatedSequences, (updatedSequence) => {
      if (updatedSequence?.key === sequence?.key) {
        updatedSequence.group = value?.id;
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
      }
      showAlert(dispatch, response?.toast);
      setShowLinearProgress(false);
    });
  };

  const getSequenceGroupOptions = useCallback(() => {
    const sequenceGroupOptions = [];
    _.forEach(show?.sequenceGroups, (group) => {
      sequenceGroupOptions.push({ label: group.name, id: group.name });
    });
    setSequenceGroupOptions(sequenceGroupOptions);
  }, [show]);

  useEffect(() => {
    getSequenceGroupOptions();
  }, [getSequenceGroupOptions]);

  return (
    <Drawer
      sx={{
        ml: open ? 3 : 0,
        flexShrink: 0,
        zIndex: 1200,
        overflowX: 'hidden',
        width: { xs: 320, md: 450, lg: 650 },
        '& .MuiDrawer-paper': {
          height: '100vh',
          width: { xs: 320, md: 450, lg: 650 },
          position: 'fixed',
          border: 'none',
          borderRadius: '0px'
        }
      }}
      variant="temporary"
      anchor="right"
      open={open}
      ModalProps={{ keepMounted: true }}
      onClose={() => {
        handleDrawerOpen();
      }}
    >
      {open && (
        <>
          <Box sx={{ p: 3 }}>
            <Grid container alignItems="center" spacing={0.5} justifyContent="space-between">
              <Grid item sx={{ width: 'calc(100% - 50px)' }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Button
                    variant="text"
                    color="error"
                    sx={{ p: 0.5, minWidth: 32, display: { xs: 'block', md: 'none' } }}
                    onClick={handleDrawerOpen}
                  >
                    <HighlightOffIcon />
                  </Button>
                  <Typography
                    variant="h4"
                    sx={{
                      display: 'inline-block',
                      width: 'calc(100% - 34px)',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      verticalAlign: 'middle'
                    }}
                  >
                    {sequence?.name}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <PerfectScrollbar component="div">
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        type="text"
                        fullWidth
                        label="Display Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e?.target?.value)}
                        onBlur={saveSequences}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        type="text"
                        fullWidth
                        label="Artist"
                        value={artist}
                        onChange={(e) => setArtist(e?.target?.value)}
                        onBlur={saveSequences}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        type="text"
                        fullWidth
                        label="Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e?.target?.value)}
                        onBlur={saveSequences}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        type="text"
                        fullWidth
                        label="Category"
                        value={category}
                        onChange={(e) => setCategory(e?.target?.value)}
                        onBlur={saveSequences}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={10} sm={10}>
                          <Autocomplete
                            sx={{ width: '100%' }}
                            options={sequenceGroupOptions}
                            value={getSelectedSequenceGroup()}
                            renderInput={(params) => <TextField {...params} label="Sequence Group" />}
                            onChange={handleSequenceGroupChange}
                            disabled={!sequence.active}
                          />
                        </Grid>
                        <Grid item xs={1} sm={1}>
                          <Tooltip placement="top" title="Create Sequence Group">
                            <IconButton
                              color="primary"
                              sx={{
                                color: theme.palette.green.dark,
                                borderColor: theme.palette.green.main
                              }}
                              size="small"
                              onClick={() => setCreateNewSequenceGroupOpen(true)}
                              disabled={!sequence.active}
                            >
                              <AddTwoToneIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={1} sm={1}>
                          <Tooltip placement="top" title="Manage Sequence Groups">
                            <IconButton
                              color="primary"
                              sx={{
                                color: theme.palette.yellow.dark,
                                borderColor: theme.palette.yellow.main
                              }}
                              size="small"
                              onClick={() => setManageSequenceGroupsOpen(true)}
                              disabled={!sequence.active}
                            >
                              <SettingsTwoToneIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </PerfectScrollbar>
        </>
      )}
      <Modal
        open={createNewSequenceGroupOpen}
        onClose={() => setCreateNewSequenceGroupOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <CreateNewSequenceGroup handleClose={() => setCreateNewSequenceGroupOpen(false)} />
      </Modal>
      <Modal
        open={manageSequenceGroupsOpen}
        onClose={() => setManageSequenceGroupsOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ManageSequenceGroups handleClose={() => setManageSequenceGroupsOpen(false)} />
      </Modal>
    </Drawer>
  );
};

SequenceDetails.propTypes = {
  setShowLinearProgress: PropTypes.func,
  sequence: PropTypes.object,
  open: PropTypes.bool,
  handleDrawerOpen: PropTypes.func
};

export default SequenceDetails;
