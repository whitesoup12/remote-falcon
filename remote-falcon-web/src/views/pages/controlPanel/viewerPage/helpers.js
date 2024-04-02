import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import OpenInFullTwoToneIcon from '@mui/icons-material/OpenInFullTwoTone';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import ViewSidebarTwoToneIcon from '@mui/icons-material/ViewSidebarTwoTone';
import { TableRow, TableCell, TableContainer, Table, TableHead, TableBody, Link } from '@mui/material';
import _ from 'lodash';

import {
  saveRemoteViewerPageService,
  addRemoteViewerPageService,
  deleteRemoteViewerPageService,
  validateHtmlService
} from 'services/controlPanel/viewerPage.service';
import HtmlValidationSkeleton from 'ui-component/cards/Skeleton/HtmlValidationSkeleton';
import { showAlert } from 'views/pages/globalPageHelpers';

export const handleStartingTemplateChange = (event, value, setSelectedStartingTemplate) => {
  setSelectedStartingTemplate(value);
};

export const validateHtml = async (dispatch, viewerPageHtml, setHtmlValidation, setIsValidating) => {
  setIsValidating(true);
  try {
    const response = await validateHtmlService(viewerPageHtml);
    const messages = response?.data?.messages;
    const sortedMessages = _.orderBy(messages, ['lastLine'], ['asc']);
    setHtmlValidation(sortedMessages);
  } catch (err) {
    showAlert({ dispatch, message: 'Unable to validate HTML', alert: 'warning' });
  }
  setIsValidating(false);
};

export const editorChanged = (editorContent, setIsValidating, setActiveViewerPageHtml, setViewerPageHtmlBase64, throttledValidation) => {
  setIsValidating(true);
  setActiveViewerPageHtml(editorContent);
  const viewerPageHtmlBase64 = `data:text/html;base64,${btoa(unescape(encodeURIComponent(editorContent)))}`;
  setViewerPageHtmlBase64(viewerPageHtmlBase64);
  throttledValidation.current(editorContent);
};

const validationExceptions = [
  'Start tag seen without seeing a doctype first',
  'Element “head” is missing',
  '{after-hours-message}',
  '{jukebox-dynamic-container}',
  '{playlist-voting-dynamic-container}',
  '{location-code-dynamic-container}',
  'instructional-text'
];

const isValidationException = (message) => {
  let isException = false;
  _.forEach(validationExceptions, (exception) => {
    if (message.includes(exception)) {
      isException = true;
    }
  });
  return isException;
};

const htmlValidationRowClicked = (lineNumber, setEditorLineNumber) => {
  window.scrollTo(0, 0);
  setEditorLineNumber(lineNumber);
};

const openCreateViewerPage = (setNewViewerPageName, setNewViewerPageError, setCreateViewerPageOpen) => {
  setNewViewerPageName();
  setNewViewerPageError(false);
  setCreateViewerPageOpen(true);
};
export const closeCreateViewerPage = (setNewViewerPageName, setNewViewerPageError, setCreateViewerPageOpen) => {
  setNewViewerPageName();
  setNewViewerPageError(false);
  setCreateViewerPageOpen(false);
};

const openManageViewerPages = (setNewViewerPageName, setNewViewerPageError, setManageViewerPagesOpen) => {
  setNewViewerPageName();
  setNewViewerPageError(false);
  setManageViewerPagesOpen(true);
};
export const closeManageViewerPages = (setNewViewerPageName, setNewViewerPageError, setManageViewerPagesOpen) => {
  setNewViewerPageName();
  setNewViewerPageError(false);
  setManageViewerPagesOpen(false);
};

const openViewerPagePreviewDialog = (setOpenPreview) => {
  setOpenPreview(true);
};
export const closeViewerPagePreviewDialog = (setOpenPreview) => {
  setOpenPreview(false);
};

export const handleInputChange = (event, hook) => {
  hook(event?.target?.value);
};

export const editViewerPage = async (
  viewerPageHtml,
  viewerPageName,
  setManageViewerPagesOpen,
  fetchRemoteViewerPages,
  setActiveViewerPageHtml,
  setActiveViewerPageName,
  setViewerPageHtmlBase64,
  throttledValidation
) => {
  setManageViewerPagesOpen(false);
  await fetchRemoteViewerPages();
  setActiveViewerPageHtml(viewerPageHtml);
  setActiveViewerPageName(viewerPageName);
  const viewerPageHtmlBase64 = `data:text/html;base64,${btoa(unescape(encodeURIComponent(viewerPageHtml)))}`;
  setViewerPageHtmlBase64(viewerPageHtmlBase64);
  throttledValidation.current(viewerPageHtml);
};

export const createNewViewerPage = async (
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
) => {
  setNewViewerPageError(false);
  setIsSavingNewPage(true);
  if (!newViewerPageName) {
    setNewViewerPageError(true);
  } else {
    let templateHtml = '';
    _.forEach(remoteViewerPageTemplates, (template) => {
      if (template.key === selectedStartingTemplate.id) {
        templateHtml = template.content;
      }
    });
    const createViewerPageData = {
      viewerPageName: newViewerPageName,
      viewerPageHtml: templateHtml
    };
    const response = await addRemoteViewerPageService(createViewerPageData);
    if (response?.status === 200) {
      showAlert({ dispatch, message: 'Viewer Page Created' });
      closeCreateViewerPage(setNewViewerPageName, setNewViewerPageError, setCreateViewerPageOpen);
      fetchRemoteViewerPages();
    } else if (response?.status === 204) {
      showAlert({ dispatch, message: `${newViewerPageName} Already Exists`, alert: 'warning' });
      closeCreateViewerPage(setNewViewerPageName, setNewViewerPageError, setCreateViewerPageOpen);
    } else {
      closeCreateViewerPage(setNewViewerPageName, setNewViewerPageError, setCreateViewerPageOpen);
      showAlert({ dispatch, alert: 'error' });
    }
  }
  setIsSavingNewPage(false);
};

const saveViewerPage = async (dispatch, remoteViewerPages, activeViewerPageHtml, activeViewerPageName, coreInfo) => {
  let modifiedRemoteViewerPage = {};
  _.map(remoteViewerPages, (viewerPage) => {
    if (viewerPage.viewerPageName === activeViewerPageName) {
      modifiedRemoteViewerPage = {
        ...viewerPage,
        viewerPageHtml: activeViewerPageHtml
      };
    }
  });
  const response = await saveRemoteViewerPageService(modifiedRemoteViewerPage);
  if (response?.status === 200) {
    showAlert({ dispatch, message: 'Viewer Page Saved' });
  } else {
    showAlert({ dispatch, alert: 'error' });
  }
};

export const deleteViewerPage = async (
  dispatch,
  remoteViewerPageKey,
  setIsLoading,
  setManageViewerPagesOpen,
  fetchRemoteViewerPages,
  coreInfo
) => {
  setManageViewerPagesOpen(false);
  setIsLoading(true);
  const response = await deleteRemoteViewerPageService(remoteViewerPageKey);
  if (response?.status === 200) {
    showAlert({ dispatch, message: 'Viewer Page Deleted' });
    setIsLoading(false);
    await fetchRemoteViewerPages();
  } else {
    await fetchRemoteViewerPages();
    showAlert({ dispatch, alert: 'error' });
  }
  setIsLoading(false);
};

const toggleSidePreview = (setOpenSidePreview, openSidePreview) => {
  setOpenSidePreview(!openSidePreview);
};

const copyHtmlToClipboard = async (dispatch, activeViewerPageHtml, coreInfo) => {
  if ('clipboard' in navigator) {
    await navigator.clipboard.writeText(activeViewerPageHtml);
  } else {
    document.execCommand('copy', true, activeViewerPageHtml);
  }
  showAlert({ dispatch, message: 'HTML Copied' });
};

export const openCloseActionsSpeedial = (setOpenSpeedial, openSpeedial) => {
  setOpenSpeedial(!openSpeedial);
};

export const speedialActions = (
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
) => [
  {
    icon: <AddTwoToneIcon sx={{ color: theme.palette.grey[700] }} fontSize="medium" />,
    name: 'New Viewer Page',
    action: () => openCreateViewerPage(setNewViewerPageName, setNewViewerPageError, setCreateViewerPageOpen),
    enabled: createNewPageEnabled
  },
  {
    icon: <SaveTwoToneIcon sx={{ color: theme.palette.grey[700] }} fontSize="medium" />,
    name: 'Save Viewer Page',
    action: () =>
      saveViewerPage(dispatch, remoteViewerPages, activeViewerPageHtml, activeViewerPageName, setOpenSpeedial, setIsLoading, coreInfo),
    enabled: true
  },
  {
    icon: <ContentCopyTwoToneIcon sx={{ color: theme.palette.grey[700] }} fontSize="medium" />,
    name: 'Copy HTML',
    action: () => copyHtmlToClipboard(dispatch, activeViewerPageHtml, coreInfo),
    enabled: true
  },
  {
    icon: <SettingsTwoToneIcon sx={{ color: theme.palette.grey[700] }} fontSize="medium" />,
    name: 'Manage Viewer Pages',
    action: () => openManageViewerPages(setNewViewerPageName, setNewViewerPageError, setManageViewerPagesOpen),
    enabled: true
  },
  {
    icon: <ViewSidebarTwoToneIcon sx={{ color: theme.palette.grey[700] }} fontSize="medium" />,
    name: 'Toggle Side Preview',
    action: () => toggleSidePreview(setOpenSidePreview, openSidePreview),
    enabled: true
  },
  {
    icon: <OpenInFullTwoToneIcon sx={{ color: theme.palette.grey[700] }} fontSize="medium" />,
    name: 'Toggle Fullscreen Preview',
    action: () => openViewerPagePreviewDialog(setOpenPreview),
    enabled: true
  }
];

export const renderHtmlValidation = (isValidating, htmlValidation, setEditorLineNumber) =>
  isValidating ? (
    <HtmlValidationSkeleton />
  ) : (
    <TableContainer>
      <Table sx={{ minWidth: 350 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Type</TableCell>
            <TableCell align="left">Message</TableCell>
            <TableCell align="left">Line Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="validation">
          {_.map(
            htmlValidation,
            (validation) =>
              validation.type === 'error' &&
              !isValidationException(validation.message) && (
                <TableRow hover>
                  <TableCell align="left">{validation.type}</TableCell>
                  <TableCell align="left">{validation.message}</TableCell>
                  <TableCell align="left">
                    <Link style={{ cursor: 'pointer' }} onClick={() => htmlValidationRowClicked(validation.lastLine, setEditorLineNumber)}>
                      {validation.lastLine}
                    </Link>
                  </TableCell>
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
