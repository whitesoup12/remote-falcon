import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Dialog, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const ViewerPagePreviewDialog = ({ openPreview, closeViewerPagePreviewDialog, viewerPageName, viewerPageHtmlBase64 }) => (
  <Dialog fullScreen open={openPreview} onClose={closeViewerPagePreviewDialog} TransitionComponent={Transition}>
    {openPreview && (
      <>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={closeViewerPagePreviewDialog} aria-label="close" size="large">
              <CloseIcon />
            </IconButton>
            <Typography variant="h3" color="inherit" sx={{ ml: 2, flex: 1 }}>
              {viewerPageName} Preview
            </Typography>
          </Toolbar>
        </AppBar>

        <iframe title="viewerPagePreview" src={viewerPageHtmlBase64} style={{ height: '100%' }} />
      </>
    )}
  </Dialog>
);

ViewerPagePreviewDialog.propTypes = {
  closeViewerPagePreviewDialog: PropTypes.func,
  openPreview: PropTypes.bool,
  viewerPageName: PropTypes.string,
  viewerPageHtmlBase64: PropTypes.string
};

export default ViewerPagePreviewDialog;
