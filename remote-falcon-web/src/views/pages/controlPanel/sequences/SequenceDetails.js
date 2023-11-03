import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import { Box, Button, Divider, Drawer, Grid, Typography, Tooltip, IconButton, Stack, TextField, Autocomplete } from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

const SequenceDetails = ({
  theme,
  sequence,
  open,
  handleDrawerOpen,
  sequenceGroupOptions,
  openCreateNewSequenceGroup,
  openManageSequenceGroups,
  handleInputChange,
  saveSequenceChanges,
  handleSequenceGroupChange
}) => (
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
                  {sequence?.sequenceName}
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
                      name="sequenceDisplayName"
                      label="Sequence Display Name"
                      defaultValue={sequence.sequenceDisplayName}
                      onChange={(event) => handleInputChange(event, sequence.sequenceKey)}
                      onBlur={() => saveSequenceChanges()}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      fullWidth
                      name="sequenceImageUrl"
                      label="Sequence Image URL"
                      defaultValue={sequence.sequenceImageUrl}
                      onChange={(event) => handleInputChange(event, sequence.sequenceKey)}
                      onBlur={() => saveSequenceChanges()}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      fullWidth
                      name="sequenceCategory"
                      label="Sequence Category"
                      defaultValue={sequence.sequenceCategory}
                      onChange={(event) => handleInputChange(event, sequence.sequenceKey)}
                      onBlur={() => saveSequenceChanges()}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={10} sm={10}>
                        <Autocomplete
                          sx={{ width: '100%' }}
                          options={sequenceGroupOptions}
                          defaultValue={_.find(sequenceGroupOptions, (group) => group.label === sequence.sequenceGroup)}
                          renderInput={(params) => <TextField {...params} label="Sequence Group" />}
                          onChange={(event, value, setShowLinearProgress, fetchSequences, fetchSequenceGroups) =>
                            handleSequenceGroupChange(
                              event,
                              value,
                              sequence.sequenceKey,
                              setShowLinearProgress,
                              fetchSequences,
                              fetchSequenceGroups
                            )
                          }
                          disabled={!sequence.isSequenceActive}
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
                            onClick={openCreateNewSequenceGroup}
                            disabled={!sequence.isSequenceActive}
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
                            onClick={openManageSequenceGroups}
                            disabled={!sequence.isSequenceActive}
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
  </Drawer>
);

SequenceDetails.propTypes = {
  theme: PropTypes.object,
  open: PropTypes.bool,
  handleDrawerOpen: PropTypes.func,
  sequence: PropTypes.object,
  sequenceGroupOptions: PropTypes.array,
  openCreateNewSequenceGroup: PropTypes.func,
  openManageSequenceGroups: PropTypes.func,
  handleInputChange: PropTypes.func,
  saveSequenceChanges: PropTypes.func,
  handleSequenceGroupChange: PropTypes.func
};

export default SequenceDetails;
