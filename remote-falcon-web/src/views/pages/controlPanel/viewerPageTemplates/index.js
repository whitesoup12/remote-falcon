import { useCallback, useEffect, useState } from 'react';

import { Box, Grid, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';

import { getRemoteViewerPageTemplatesFromGithubService } from 'services/controlPanel/viewerPage.service';
import { useDispatch, useSelector } from 'store';
import { gridSpacing, unexpectedErrorMessage } from 'store/constant';
import { setRemoteViewerPageTemplates } from 'store/slices/controlPanel';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';
import ViewerPageTemplatesSkeleton from 'ui-component/cards/Skeleton/ViewerPageTemplatesSkeleton';
import { RFTabPanel, RFTab } from 'ui-component/RFTabPanel';

import FreeTemplates from './FreeTemplates';
import { tabOptions, handleTemplateChange } from './helpers';
import PremiumTemplates from './PremiumTemplates';

const ViewerPageTemplates = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { remoteViewerPageTemplates } = useSelector((state) => state.controlPanel);
  const { show } = useSelector((state) => state.show);

  const [showSkeletonLoader, setShowSkeletonLoader] = useState(false);
  const [viewerPageTemplateOptions, setViewerPageTemplateOptions] = useState();
  const [selectedTemplate, setSelectedTemplate] = useState();
  const [selectedTemplateBase64, setSelectedTemplateBase64] = useState();

  const fetchRemoteViewerPageTemplates = useCallback(async () => {
    setShowSkeletonLoader(true);
    try {
      const remoteViewerPageTemplates = await getRemoteViewerPageTemplatesFromGithubService();
      dispatch(
        setRemoteViewerPageTemplates({
          ...remoteViewerPageTemplates
        })
      );
      const templateOptions = [];
      _.forEach(remoteViewerPageTemplates, (template) => {
        templateOptions.push({ label: template?.title, id: template?.key });
      });
      setViewerPageTemplateOptions(templateOptions);
      const selectedTemplateBase64 = `data:text/html;base64,${btoa(unescape(encodeURIComponent(remoteViewerPageTemplates[0]?.content)))}`;
      setSelectedTemplateBase64(selectedTemplateBase64);
      setSelectedTemplate(templateOptions[0]);
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: unexpectedErrorMessage,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
    }
    setShowSkeletonLoader(false);
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      await fetchRemoteViewerPageTemplates();
    };

    init();
  }, [fetchRemoteViewerPageTemplates, show]);

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard title="Viewer Page Templates" content={false} />
          {showSkeletonLoader ? (
            <ViewerPageTemplatesSkeleton tabOptions={tabOptions} />
          ) : (
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} lg={3}>
                <CardContent>
                  <RFTabPanel tabOptions={tabOptions} orientation="vertical" />
                </CardContent>
              </Grid>
              <Grid item xs={12} lg={9}>
                <CardContent
                  sx={{
                    borderLeft: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[200],
                    height: '100%'
                  }}
                >
                  <RFTab index={0}>
                    <FreeTemplates
                      viewerPageTemplateOptions={viewerPageTemplateOptions}
                      selectedTemplate={selectedTemplate}
                      selectedTemplateBase64={selectedTemplateBase64}
                      handleTemplateChange={(event, value) =>
                        handleTemplateChange(event, value, remoteViewerPageTemplates, setSelectedTemplate, setSelectedTemplateBase64)
                      }
                    />
                  </RFTab>
                  <RFTab index={1}>
                    <PremiumTemplates />
                  </RFTab>
                </CardContent>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewerPageTemplates;
