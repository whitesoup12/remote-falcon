import { Grid, CardActions, Autocomplete, TextField, Stack } from '@mui/material';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

const FreeTemplates = ({ viewerPageTemplateOptions, selectedTemplate, selectedTemplateBase64, handleTemplateChange }) => (
  <Grid item xs={12}>
    <MainCard title="Free Templates" content={false}>
      <CardActions>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                disableClearable
                value={selectedTemplate}
                options={viewerPageTemplateOptions}
                renderInput={(params) => <TextField {...params} label="Template Name" />}
                onChange={handleTemplateChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <iframe title="viewerPagePreview" src={selectedTemplateBase64} style={{ height: '50em', width: '250%' }} />
            </Grid>
          </Grid>
        </Stack>
      </CardActions>
    </MainCard>
  </Grid>
);

FreeTemplates.propTypes = {
  viewerPageTemplateOptions: PropTypes.array,
  selectedTemplate: PropTypes.object,
  selectedTemplateBase64: PropTypes.string,
  handleTemplateChange: PropTypes.func
};

export default FreeTemplates;
