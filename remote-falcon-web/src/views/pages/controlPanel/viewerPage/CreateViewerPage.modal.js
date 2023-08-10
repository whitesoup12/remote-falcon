import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  CardContent,
  CardActions,
  Grid,
  Divider,
  IconButton,
  Autocomplete,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';

const CreateViewerPageModal = ({
  handleClose,
  viewerPageTemplateOptions,
  handleInputChange,
  handleStartingTemplateChange,
  setNewViewerPageName,
  newViewerPageError,
  createNewViewerPage,
  isSavingNewPage
}) => (
  <MainCard
    sx={{
      position: 'absolute',
      width: { xs: 450, lg: 450 },
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}
    title="New Viewer Page"
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
            name="newViewerPageName"
            label="Viewer Page Name"
            error={newViewerPageError}
            onChange={(event) => handleInputChange(event, setNewViewerPageName)}
          />
        </Grid>
        <Grid item xs={12} sm={6} />
        <Grid item xs={12} sm={12}>
          <Autocomplete
            disableClearable
            options={viewerPageTemplateOptions}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            defaultValue={viewerPageTemplateOptions[0]}
            renderInput={(params) => <TextField {...params} label="Starting Template" />}
            onChange={handleStartingTemplateChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} />
      </Grid>
      <Typography align="center">There is currently a limit of 5 viewer pages</Typography>
    </CardContent>
    <Divider />
    <CardActions>
      <Grid container justifyContent="flex-end">
        <AnimateButton>
          {isSavingNewPage ? (
            <CircularProgress />
          ) : (
            <Button variant="outlined" size="large" onClick={() => createNewViewerPage()}>
              Create Page
            </Button>
          )}
        </AnimateButton>
      </Grid>
    </CardActions>
  </MainCard>
);

CreateViewerPageModal.propTypes = {
  handleClose: PropTypes.func,
  viewerPageTemplateOptions: PropTypes.array,
  handleInputChange: PropTypes.func,
  handleStartingTemplateChange: PropTypes.func,
  setNewViewerPageName: PropTypes.func,
  newViewerPageError: PropTypes.bool,
  createNewViewerPage: PropTypes.func,
  isSavingNewPage: PropTypes.bool
};

export default CreateViewerPageModal;
