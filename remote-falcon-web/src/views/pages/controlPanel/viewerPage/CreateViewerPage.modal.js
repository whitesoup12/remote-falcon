import { useCallback, useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import CloseIcon from '@mui/icons-material/Close';
import { Button, CardContent, CardActions, Grid, Divider, IconButton, Autocomplete, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import newAxios from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';

import { savePagesService } from '../../../../services/controlPanel/mutations.service';
import { useDispatch, useSelector } from '../../../../store';
import { setShow } from '../../../../store/slices/show';
import RFLoadingButton from '../../../../ui-component/RFLoadingButton';
import { UPDATE_PAGES } from '../../../../utils/graphql/controlPanel/mutations';
import { showAlert } from '../../globalPageHelpers';

const defaultViewerPages = [
  { id: 'the-og', label: 'The OG by Rick Harris', content: '' },
  { id: 'purple-halloween', label: 'Purple Halloween by StramMade3D', content: '' },
  { id: 'red-and-white', label: 'Red & White by StramMade3D', content: '' },
  { id: 'on-air', label: 'On Air by Jason Toy', content: '' },
  { id: 'lumos-light-show', label: 'Lumos Light Show by James Vance', content: '' }
];

const CreateViewerPageModal = ({ setCreateViewerPageOpen, editNewViewerPage }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.show);

  const [isLoading, setIsLoading] = useState(false);
  const [viewerPageName, setViewerPageName] = useState();
  const [viewerPageNameError, setViewerPageNameError] = useState(false);
  const [viewerPageNameErrorText, setViewerPageNameErrorText] = useState();
  const [viewerPageTemplate, setViewerPageTemplate] = useState();

  const [updatePagesMutation] = useMutation(UPDATE_PAGES);

  const createNewViewerPage = () => {
    setIsLoading(true);
    const existingViewerPageNames = _.map(show?.pages, 'name');
    if (!viewerPageName || viewerPageName === '') {
      setIsLoading(false);
      setViewerPageNameError(true);
      setViewerPageNameErrorText('Viewer Page Name Required');
      return;
    }
    if (existingViewerPageNames.includes(viewerPageName)) {
      setIsLoading(false);
      setViewerPageNameError(true);
      setViewerPageNameErrorText('Viewer Page Name Exists');
      return;
    }
    if (!viewerPageTemplate || viewerPageTemplate?.id === '') {
      setIsLoading(false);
      return;
    }
    const updatedPages = _.cloneDeep([
      ...show?.pages,
      {
        name: viewerPageName,
        active: false,
        html: viewerPageTemplate?.content
      }
    ]);
    savePagesService(updatedPages, updatePagesMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            pages: [...updatedPages]
          })
        );
        showAlert(dispatch, response?.toast);
        setIsLoading(false);
        setCreateViewerPageOpen(false);
        editNewViewerPage({
          name: viewerPageName,
          active: false,
          html: viewerPageTemplate?.content
        });
      } else {
        showAlert(dispatch, response?.toast);
        setIsLoading(false);
        setCreateViewerPageOpen(false);
      }
    });
  };

  const handleDefaultViewerPageChange = (event, value) => {
    setViewerPageTemplate(value);
  };

  const getDefaultViewerPageTemplates = useCallback(async () => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    await _.forEach(defaultViewerPages, async (defaultViewerPage) => {
      const viewerPage = await newAxios.get(
        `https://raw.githubusercontent.com/whitesoup12/remote-falcon-page-templates/main/templates/${defaultViewerPage.id}.html`,
        config
      );
      defaultViewerPage.content = viewerPage.data;
    });
    setViewerPageTemplate(defaultViewerPages[0]);
  }, []);

  useEffect(() => {
    getDefaultViewerPageTemplates();
  }, [getDefaultViewerPageTemplates]);

  return (
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
        <IconButton onClick={() => setCreateViewerPageOpen(false)} size="large">
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
              label="Viewer Page Name"
              value={viewerPageName}
              onChange={(e) => setViewerPageName(e?.target?.value)}
              error={viewerPageNameError}
            />
            <Typography variant="subtitle2" sx={{ mt: 2 }} color={theme.palette.error.main}>
              {viewerPageNameErrorText}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} />
          <Grid item xs={12} sm={12}>
            <Autocomplete
              disableClearable
              options={defaultViewerPages}
              value={viewerPageTemplate}
              defaultValue={defaultViewerPages[0]}
              renderInput={(params) => <TextField {...params} label="Starting Template" />}
              onChange={handleDefaultViewerPageChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} />
        </Grid>
        <Typography align="center">There is currently a limit of 5 viewer pages</Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Grid container justifyContent="flex-end">
          <RFLoadingButton loading={isLoading} onClick={() => createNewViewerPage()} color="primary">
            Create Page
          </RFLoadingButton>
        </Grid>
      </CardActions>
    </MainCard>
  );
};

CreateViewerPageModal.propTypes = {
  setCreateViewerPageOpen: PropTypes.func,
  editViewerPage: PropTypes.func
};

export default CreateViewerPageModal;
