import {
  Box,
  Button,
  Drawer,
  Grid,
  Typography,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';

import { createWorkItemService } from 'services/controlPanel/tracker.service';
import { useDispatch } from 'store';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { showAlert, mixpanelTrack } from 'views/pages/globalPageHelpers';

import { workItemTypes, validationSchema } from './helpers';

const NewWorkItem = ({ coreInfo, newWorkItemDrawerOpen, handleNewWorkItemDrawer, setIsLoading, fetchWorkItems }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      type: 'Bug',
      title: '',
      description: '',
      severity: '4 - Low'
    },
    validationSchema,
    onSubmit: async (values) => {
      handleNewWorkItemDrawer();
      setIsLoading(true);
      const workItem = {
        type: values.type,
        title: values.title,
        description: values.description,
        severity: values.severity
      };
      try {
        const response = await createWorkItemService(workItem);
        if (response?.status === 200) {
          mixpanelTrack(`New ${workItem.type} Work Item Created`, coreInfo);
          showAlert({ dispatch, message: `${workItem?.title} Created` });
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

  return (
    <Drawer
      sx={{
        ml: newWorkItemDrawerOpen ? 3 : 0,
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
      open={newWorkItemDrawerOpen}
      ModalProps={{ keepMounted: true }}
      onClose={handleNewWorkItemDrawer}
    >
      {newWorkItemDrawerOpen && (
        <Box sx={{ p: 3 }}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h4">Add Work Item</Typography>
              </Grid>
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
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1">Type:</Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <FormControl fullWidth>
                      <Select
                        id="type"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        {workItemTypes.map((type, index) => (
                          <MenuItem key={index} value={type.id}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
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
                          <FormControlLabel value="2 - High" control={<Radio color="error" sx={{ color: 'error.main' }} />} label="High" />
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
                <AnimateButton>
                  <Button fullWidth variant="contained" type="submit">
                    Save
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        </Box>
      )}
    </Drawer>
  );
};

NewWorkItem.propTypes = {
  coreInfo: PropTypes.object,
  newWorkItemDrawerOpen: PropTypes.bool,
  handleNewWorkItemDrawer: PropTypes.func,
  setIsLoading: PropTypes.func,
  fetchWorkItems: PropTypes.func
};

export default NewWorkItem;
