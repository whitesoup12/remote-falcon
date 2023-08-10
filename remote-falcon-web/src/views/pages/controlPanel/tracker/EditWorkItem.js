import { useState, useEffect, useCallback } from 'react';

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Typography,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import _ from 'lodash';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { editWorkItemService, deleteWorkItemService, fetchWorkItemCommentsService } from 'services/controlPanel/tracker.service';
import { useDispatch } from 'store';
import TrackerSkeleton from 'ui-component/cards/Skeleton/TrackerSkeleton';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { showAlert, mixpanelTrack } from 'views/pages/globalPageHelpers';

import AddComment from './AddComment';
import DeleteStory from './DeleteStory';
import { validationSchema, workItemStates } from './helpers';
import WorkItemComment from './WorkItemComment';

const EditWorkItem = ({ workItem, coreInfo, open, handleDrawerOpen, setIsLoading, fetchWorkItems }) => {
  const dispatch = useDispatch();

  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [workItemComments, setWorkItemComments] = useState([]);

  const fetchWorkItemComments = useCallback(async () => {
    try {
      const workItemCommentsResponse = await fetchWorkItemCommentsService(workItem.id);
      const workItemComments = workItemCommentsResponse.data;
      setWorkItemComments(workItemComments);
    } catch (err) {
      showAlert({ dispatch, alert: 'error' });
    }
  }, [dispatch, workItem.id]);

  useEffect(() => {
    const init = async () => {
      if (open && workItem?.commentCount > 0) {
        setIsCommentsLoading(true);
        await fetchWorkItemComments();
        setIsCommentsLoading(false);
      }
    };

    init();
  }, [dispatch, fetchWorkItemComments, coreInfo, open, workItem]);

  const createdDateParse = moment(workItem?.createdDate, 'YYYY-MM-DDTHH:mm:ss.SSZ').tz(coreInfo?.timezone);
  const commentDateFormatted = `${createdDateParse.format('YYYY-MM-DD HH:mm:ss')}`;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: workItem.id,
      type: workItem.type,
      title: workItem.title,
      severity: workItem.severity,
      description: workItem.description,
      state: workItem?.state,
      comments: workItemComments
    },
    validationSchema,
    onSubmit: async (values) => {
      handleDrawerOpen();
      setIsLoading(true);
      const workItem = {
        id: values.id,
        type: values.type,
        title: values.title,
        description: values.description,
        state: values.state,
        severity: values.severity
      };
      try {
        const response = await editWorkItemService(workItem);
        if (response?.status === 200) {
          mixpanelTrack('Work Item Updated', coreInfo);
          showAlert({ dispatch, message: `${workItem?.title} Updated` });
        } else {
          showAlert({ dispatch, alert: 'error' });
        }
      } catch {
        showAlert({ dispatch, alert: 'error' });
      }
      setIsLoading(false);
      fetchWorkItems();
    }
  });

  const [openModal, setOpenModal] = useState(false);
  const handleModalClose = (status) => {
    setOpenModal(false);
    if (status) {
      handleDrawerOpen();
    }
  };

  const deleteWorkItem = async (workItem) => {
    handleDrawerOpen();
    setIsLoading(true);
    try {
      const response = await deleteWorkItemService(workItem?.id);
      if (response?.status === 200) {
        mixpanelTrack('Work Item Deleted', coreInfo);
        showAlert({ dispatch, message: `${workItem?.title} Delete` });
      } else {
        showAlert({ dispatch, alert: 'error' });
      }
    } catch {
      showAlert({ dispatch, alert: 'error' });
    }
    setIsLoading(false);
    fetchWorkItems();
  };

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
        formik.resetForm();
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
                    {workItem.title}
                  </Typography>
                </Stack>
                <Typography variant="subtitle2" sx={{ ml: 0.5, mt: 1 }}>
                  Created by {workItem?.requestedBy} on {commentDateFormatted}
                </Typography>
              </Grid>

              <Grid item>
                <Button
                  disabled={coreInfo?.remoteName !== workItem?.requestedBy}
                  variant="text"
                  color="error"
                  sx={{ p: 0.5, minWidth: 32 }}
                  onClick={() => setOpenModal(true)}
                >
                  <DeleteTwoToneIcon />
                </Button>
                {openModal && (
                  <DeleteStory
                    title={workItem.title}
                    open={openModal}
                    handleClose={handleModalClose}
                    deleteWorkItem={() => deleteWorkItem(workItem)}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <PerfectScrollbar options={{ wheelPropagation: false }}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="title"
                          name="title"
                          label="Title"
                          value={formik.values.title}
                          onChange={formik.handleChange}
                          error={formik.touched.title && Boolean(formik.errors.title)}
                          helperText={formik.touched.title && formik.errors.title}
                        />
                      </Grid>
                      {formik.values.type === 'Bug' && (
                        <Grid item xs={12}>
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="subtitle1">Severity:</Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-label="color"
                                  value={formik.values.severity}
                                  onChange={formik.handleChange}
                                  name="severity"
                                  id="severity"
                                >
                                  <FormControlLabel
                                    value="4 - Low"
                                    control={<Radio color="primary" sx={{ color: 'primary.main' }} />}
                                    label="Low"
                                  />
                                  <FormControlLabel
                                    value="3 - Medium"
                                    control={<Radio color="warning" sx={{ color: 'warning.main' }} />}
                                    label="Medium"
                                  />
                                  <FormControlLabel
                                    value="2 - High"
                                    control={<Radio color="error" sx={{ color: 'error.main' }} />}
                                    label="High"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1">Description:</Typography>
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <TextField
                              fullWidth
                              id="description"
                              name="description"
                              multiline
                              rows={10}
                              value={formik.values.description}
                              onChange={formik.handleChange}
                              error={formik.touched.description && Boolean(formik.errors.description)}
                              helperText={formik.touched.description && formik.errors.description}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1">State:</Typography>
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <FormControl fullWidth>
                              <Select
                                id="state"
                                name="state"
                                displayEmpty
                                value={formik.values.state}
                                onChange={formik.handleChange}
                                inputProps={{ 'aria-label': 'Without label' }}
                              >
                                {workItemStates.map((state, index) => (
                                  <MenuItem key={index} value={state.id}>
                                    {state.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      {!(coreInfo.userRole !== 'ADMIN' && coreInfo?.remoteName !== workItem?.requestedBy) && (
                        <Grid item xs={12}>
                          <AnimateButton>
                            <Button
                              fullWidth
                              variant="contained"
                              type="submit"
                              // disabled={!!(coreInfo.userRole !== 'ADMIN' && coreInfo?.remoteName !== workItem?.requestedBy)}
                            >
                              Save
                            </Button>
                          </AnimateButton>
                        </Grid>
                      )}
                    </Grid>
                  </form>
                </Grid>
                <Grid item xs={12}>
                  <AddComment coreInfo={coreInfo} workItemId={workItem?.id} fetchWorkItems={fetchWorkItems} />
                </Grid>
                {isCommentsLoading ? (
                  <TrackerSkeleton />
                ) : (
                  <Grid item xs={12} sx={{ mb: 10 }}>
                    {workItemComments &&
                      _.map(workItemComments, (comment, index) => <WorkItemComment key={index} comment={comment} coreInfo={coreInfo} />)}
                  </Grid>
                )}
              </Grid>
            </Box>
          </PerfectScrollbar>
        </>
      )}
    </Drawer>
  );
};

EditWorkItem.propTypes = {
  open: PropTypes.bool,
  coreInfo: PropTypes.object,
  handleDrawerOpen: PropTypes.func,
  workItem: PropTypes.object,
  setIsLoading: PropTypes.func,
  fetchWorkItems: PropTypes.func
};

export default EditWorkItem;
