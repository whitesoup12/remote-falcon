import { useState, useCallback, useEffect } from 'react';

import { useMutation } from '@apollo/client';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import OpenInFullTwoToneIcon from '@mui/icons-material/OpenInFullTwoTone';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import ViewSidebarTwoToneIcon from '@mui/icons-material/ViewSidebarTwoTone';
import { SpeedDialIcon, SpeedDialAction, SpeedDial, Modal } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { savePagesService } from '../../../../services/controlPanel/mutations.service';
import { useDispatch, useSelector } from '../../../../store';
import { setShow } from '../../../../store/slices/show';
import { UPDATE_PAGES } from '../../../../utils/graphql/controlPanel/mutations';
import { showAlert } from '../../globalPageHelpers';
import CreateViewerPageModal from './CreateViewerPage.modal';
import ManageViewerPagesModal from './ManageViewerPages.modal';
import ViewerPagePreviewDialog from './ViewerPagePreview.dialog';

const ViewerPageActions = ({
  activeViewerPageHtml,
  activeViewerPageName,
  activeViewerPageHtmlBase64,
  setOpenSidePreview,
  openSidePreview,
  editViewerPage,
  editNewViewerPage
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.show);

  const [createViewerPageOpen, setCreateViewerPageOpen] = useState(false);
  const [manageViewerPagesOpen, setManageViewerPagesOpen] = useState(false);
  const [openFullPreview, setOpenFullPreview] = useState(false);

  const [updatePagesMutation] = useMutation(UPDATE_PAGES);

  const saveViewerPage = () => {
    const updatedPages = _.cloneDeep([...show?.pages]);
    _.forEach(updatedPages, (page) => {
      if (page?.name === activeViewerPageName) {
        page.html = activeViewerPageHtml;
      }
    });
    savePagesService(updatedPages, updatePagesMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            pages: [...updatedPages]
          })
        );
        showAlert(dispatch, response?.toast);
        setCreateViewerPageOpen(false);
      } else {
        showAlert(dispatch, response?.toast);
        setCreateViewerPageOpen(false);
      }
    });
  };

  const copyHtmlToClipboard = async () => {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(activeViewerPageHtml);
    } else {
      document.execCommand('copy', true, activeViewerPageHtml);
    }
    showAlert(dispatch, { message: 'HTML Copied' });
  };

  const speedialActions = () => [
    {
      icon: <AddTwoToneIcon sx={{ color: theme.palette.grey[700] }} fontSize="medium" />,
      name: 'New Viewer Page',
      action: () => setCreateViewerPageOpen(true),
      enabled: show?.pages?.length < 5 || process?.env?.REACT_APP_HOST_ENV === 'local'
    },
    {
      icon: <SaveTwoToneIcon sx={{ color: theme.palette.grey[700] }} fontSize="medium" />,
      name: 'Save Viewer Page',
      action: () => saveViewerPage(),
      enabled: true
    },
    {
      icon: <ContentCopyTwoToneIcon sx={{ color: theme.palette.grey[700] }} fontSize="medium" />,
      name: 'Copy HTML',
      action: () => copyHtmlToClipboard(),
      enabled: true
    },
    {
      icon: <SettingsTwoToneIcon sx={{ color: theme.palette.grey[700] }} fontSize="medium" />,
      name: 'Manage Viewer Pages',
      action: () => setManageViewerPagesOpen(true),
      enabled: true
    },
    {
      icon: <ViewSidebarTwoToneIcon sx={{ color: theme.palette.grey[700] }} fontSize="medium" />,
      name: 'Toggle Side Preview',
      action: () => setOpenSidePreview(!openSidePreview),
      enabled: true
    },
    {
      icon: <OpenInFullTwoToneIcon sx={{ color: theme.palette.grey[700] }} fontSize="medium" />,
      name: 'Toggle Fullscreen Preview',
      action: () => setOpenFullPreview(true),
      enabled: true
    }
  ];

  return (
    <>
      <SpeedDial
        sx={{
          '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
            top: theme.spacing(20),
            left: theme.spacing(20)
          }
        }}
        ariaLabel="Actions Speedial"
        icon={<SpeedDialIcon />}
        open
        hidden
        direction="right"
      >
        {speedialActions().map(
          (action) =>
            action.enabled && (
              <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={() => action.action()} />
            )
        )}
      </SpeedDial>
      <Modal
        open={createViewerPageOpen}
        onClose={() => setCreateViewerPageOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <CreateViewerPageModal setCreateViewerPageOpen={setCreateViewerPageOpen} editNewViewerPage={editNewViewerPage} />
      </Modal>
      <Modal
        open={manageViewerPagesOpen}
        onClose={() => setManageViewerPagesOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ManageViewerPagesModal setManageViewerPagesOpen={setManageViewerPagesOpen} editViewerPage={editViewerPage} />
      </Modal>
      <ViewerPagePreviewDialog
        openFullPreview={openFullPreview}
        closeFullPreview={() => setOpenFullPreview(false)}
        activeViewerPageName={activeViewerPageName}
        activeViewerPageHtmlBase64={activeViewerPageHtmlBase64}
      />
    </>
  );
};

ViewerPageActions.propTypes = {
  activeViewerPageHtml: PropTypes.string,
  activeViewerPageName: PropTypes.string,
  activeViewerPageHtmlBase64: PropTypes.string,
  setOpenSidePreview: PropTypes.func,
  openSidePreview: PropTypes.bool,
  editViewerPage: PropTypes.func,
  editNewViewerPage: PropTypes.func
};

export default ViewerPageActions;
