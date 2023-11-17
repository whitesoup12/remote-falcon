import { useState, useEffect, useRef, useCallback } from 'react';

import Editor from '@monaco-editor/react';
import { Box, Grid, Modal, Typography, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';

import { getRemoteViewerPagesService, getRemoteViewerPageTemplatesFromGithubService } from 'services/controlPanel/viewerPage.service';
import { useDispatch, useSelector } from 'store';
import { gridSpacing, unexpectedErrorMessage } from 'store/constant';
import { setRemoteViewerPages, setRemoteViewerPageTemplates } from 'store/slices/controlPanel';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';
import ViewerPageEditorSkeleton from 'ui-component/cards/Skeleton/ViewerPageEditorSkeleton';
import { mixpanelTrack } from 'views/pages/globalPageHelpers';

import CreateViewerPageModal from './CreateViewerPage.modal';
import {
  handleStartingTemplateChange,
  validateHtml,
  editorChanged,
  openCloseActionsSpeedial,
  speedialActions,
  renderHtmlValidation,
  closeManageViewerPages,
  closeCreateViewerPage,
  editViewerPage,
  deleteViewerPage,
  handleInputChange,
  createNewViewerPage,
  closeViewerPagePreviewDialog
} from './helpers';
import ManageViewerPagesModal from './ManageViewerPages.modal';
import ViewerPagePreviewDialog from './ViewerPagePreview.dialog';

const ViewerPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { coreInfo } = useSelector((state) => state.account);
  const { remoteViewerPages, remoteViewerPageTemplates } = useSelector((state) => state.controlPanel);

  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSavingNewPage, setIsSavingNewPage] = useState(false);
  const [activeViewerPageHtml, setActiveViewerPageHtml] = useState();
  const [viewerPageHtmlBase64, setViewerPageHtmlBase64] = useState();
  const [activeViewerPageName, setActiveViewerPageName] = useState();
  const [htmlValidation, setHtmlValidation] = useState([]);
  const [editorLineNumber, setEditorLineNumber] = useState(0);
  const [newViewerPageName, setNewViewerPageName] = useState();
  const [newViewerPageError, setNewViewerPageError] = useState(false);
  const [openSpeedial, setOpenSpeedial] = useState(false);
  const [createNewPageEnabled, setCreateNewPageEnabled] = useState(true);
  const [viewerPageTemplateOptions, setViewerPageTemplateOptions] = useState();
  const [selectedStartingTemplate, setSelectedStartingTemplate] = useState();
  const [createViewerPageOpen, setCreateViewerPageOpen] = useState(false);
  const [manageViewerPagesOpen, setManageViewerPagesOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [openSidePreview, setOpenSidePreview] = useState(false);

  const throttledValidation = useRef(
    _.throttle((viewerPageHtml) => validateHtml(dispatch, viewerPageHtml, setHtmlValidation, setIsValidating), 2500)
  );

  const fetchRemoteViewerPages = useCallback(async () => {
    setIsLoading(true);
    try {
      const remoteViewerPagesResponse = await getRemoteViewerPagesService();
      const remoteViewerPages = remoteViewerPagesResponse.data;
      dispatch(
        setRemoteViewerPages({
          ...remoteViewerPages
        })
      );
      setCreateNewPageEnabled(true);
      if (remoteViewerPages.length >= 5 && process?.env?.REACT_APP_HOST_ENV !== 'local') {
        setCreateNewPageEnabled(false);
      }
      _.forEach(remoteViewerPagesResponse.data, (viewerPage) => {
        if (viewerPage?.viewerPageActive) {
          setActiveViewerPageHtml(viewerPage?.viewerPageHtml);
          setActiveViewerPageName(viewerPage?.viewerPageName);
          editorChanged(viewerPage?.viewerPageHtml, setIsValidating, setActiveViewerPageHtml, setViewerPageHtmlBase64, throttledValidation);
        }
      });
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
    setIsLoading(false);
  }, [dispatch]);

  const fetchRemoteViewerPageTemplates = useCallback(async () => {
    setIsLoading(true);
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
      setSelectedStartingTemplate(templateOptions[0]);
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
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      mixpanelTrack('Viewer Page Page View', coreInfo);
      await fetchRemoteViewerPages();
      await fetchRemoteViewerPageTemplates();
    };

    init();
  }, [fetchRemoteViewerPages, fetchRemoteViewerPageTemplates, coreInfo]);

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard title="Viewer Page" content={false}>
            <Box sx={{ m: 2 }}>
              <SpeedDial
                sx={{
                  '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
                    top: theme.spacing(20),
                    left: theme.spacing(20)
                  }
                }}
                ariaLabel="Actions Speedial"
                icon={<SpeedDialIcon />}
                onClick={() => openCloseActionsSpeedial(setOpenSpeedial, openSpeedial)}
                open
                hidden
                direction="right"
              >
                {speedialActions(
                  dispatch,
                  theme,
                  createNewPageEnabled,
                  remoteViewerPages,
                  activeViewerPageHtml,
                  activeViewerPageName,
                  setOpenSpeedial,
                  setIsLoading,
                  setNewViewerPageName,
                  setNewViewerPageError,
                  setCreateViewerPageOpen,
                  setManageViewerPagesOpen,
                  setOpenSidePreview,
                  openSidePreview,
                  setOpenPreview,
                  coreInfo
                ).map(
                  (action) =>
                    action.enabled && (
                      <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={() => action.action()} />
                    )
                )}
              </SpeedDial>
              <Box sx={{ mt: 2, mb: 2 }}>
                {isLoading ? (
                  <ViewerPageEditorSkeleton />
                ) : (
                  <>
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Typography variant="h3" align="center" sx={{ marginLeft: openSidePreview ? '-50%' : '0' }}>
                        {activeViewerPageName}
                      </Typography>
                    </Box>
                    {openSidePreview ? (
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Editor
                            height="60vh"
                            defaultLanguage="html"
                            value={activeViewerPageHtml}
                            onChange={(value) =>
                              editorChanged(value, setIsValidating, setActiveViewerPageHtml, setViewerPageHtmlBase64, throttledValidation)
                            }
                            theme="vs-dark"
                            line={editorLineNumber}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <iframe title="viewerPagePreview" src={viewerPageHtmlBase64} style={{ height: '100%', width: '100%' }} />
                        </Grid>
                      </Grid>
                    ) : (
                      <Editor
                        height="60vh"
                        defaultLanguage="html"
                        value={activeViewerPageHtml}
                        onChange={(value) =>
                          editorChanged(value, setIsValidating, setActiveViewerPageHtml, setViewerPageHtmlBase64, throttledValidation)
                        }
                        theme="vs-dark"
                        line={editorLineNumber}
                      />
                    )}
                  </>
                )}
              </Box>
              <Typography variant="h3" sx={{ paddingTop: 3 }}>
                HTML Validation
              </Typography>
              {htmlValidation.length > 0 && renderHtmlValidation(isValidating, htmlValidation, setEditorLineNumber)}
            </Box>
          </MainCard>
        </Grid>
      </Grid>
      <Modal
        open={manageViewerPagesOpen}
        onClose={() => closeManageViewerPages(setNewViewerPageName, setNewViewerPageError, setManageViewerPagesOpen)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ManageViewerPagesModal
          theme={theme}
          remoteViewerPages={remoteViewerPages}
          handleClose={() => closeManageViewerPages(setNewViewerPageName, setNewViewerPageError, setManageViewerPagesOpen)}
          editViewerPage={(viewerPageHtml, viewerPageName) =>
            editViewerPage(
              viewerPageHtml,
              viewerPageName,
              setManageViewerPagesOpen,
              fetchRemoteViewerPages,
              setActiveViewerPageHtml,
              setActiveViewerPageName,
              setViewerPageHtmlBase64,
              throttledValidation
            )
          }
          deleteViewerPage={(remoteViewerPageKey) =>
            deleteViewerPage(dispatch, remoteViewerPageKey, setIsLoading, setManageViewerPagesOpen, fetchRemoteViewerPages, coreInfo)
          }
        />
      </Modal>
      <Modal
        open={createViewerPageOpen}
        onClose={() => closeCreateViewerPage(setNewViewerPageName, setNewViewerPageError, setCreateViewerPageOpen)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <CreateViewerPageModal
          handleClose={() => closeCreateViewerPage(setNewViewerPageName, setNewViewerPageError, setCreateViewerPageOpen)}
          viewerPageTemplateOptions={viewerPageTemplateOptions}
          handleInputChange={handleInputChange}
          handleStartingTemplateChange={(event, value) => handleStartingTemplateChange(event, value, setSelectedStartingTemplate)}
          createNewViewerPage={() =>
            createNewViewerPage(
              dispatch,
              newViewerPageName,
              remoteViewerPageTemplates,
              selectedStartingTemplate,
              setNewViewerPageError,
              setIsSavingNewPage,
              fetchRemoteViewerPages,
              setNewViewerPageName,
              setCreateViewerPageOpen,
              coreInfo
            )
          }
          setNewViewerPageName={setNewViewerPageName}
          newViewerPageError={newViewerPageError}
          isSavingNewPage={isSavingNewPage}
        />
      </Modal>
      <ViewerPagePreviewDialog
        openPreview={openPreview}
        closeViewerPagePreviewDialog={() => closeViewerPagePreviewDialog(setOpenPreview)}
        viewerPageName={activeViewerPageName}
        viewerPageHtmlBase64={viewerPageHtmlBase64}
      />
    </Box>
  );
};

export default ViewerPage;
