import CloseIcon from '@mui/icons-material/Close';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import {
  CardContent,
  Chip,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Stack
} from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

const ManageViewerPagesModal = ({ theme, handleClose, remoteViewerPages, editViewerPage, deleteViewerPage }) => (
  <MainCard
    sx={{
      position: 'absolute',
      width: { xs: 450, lg: 800 },
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}
    title="Manage Viewer Pages"
    content={false}
    secondary={
      <IconButton onClick={handleClose} size="large">
        <CloseIcon fontSize="small" />
      </IconButton>
    }
  >
    <CardContent>
      <TableContainer>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Status</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="sequences">
            {_.map(remoteViewerPages, (viewerPage) => (
              <TableRow hover>
                <TableCell align="center">
                  {viewerPage?.viewerPageActive && (
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light + 60,
                        color: theme.palette.success.dark
                      }}
                    />
                  )}
                  {!viewerPage?.viewerPageActive && (
                    <Chip
                      label="Inactive"
                      size="small"
                      sx={{
                        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light + 80,
                        color: theme.palette.orange.dark
                      }}
                    />
                  )}
                </TableCell>
                <TableCell align="left">{viewerPage?.viewerPageName}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" justifyContent="center" alignItems="center">
                    <Tooltip placement="top" title="Edit">
                      <IconButton
                        color="primary"
                        sx={{
                          color: theme.palette.yellow.dark,
                          borderColor: theme.palette.yellow.main
                        }}
                        size="large"
                        onClick={() => editViewerPage(viewerPage?.viewerPageHtml, viewerPage?.viewerPageName)}
                      >
                        <EditTwoToneIcon sx={{ fontSize: '1.5rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip placement="top" title="Delete">
                      <IconButton
                        color="primary"
                        sx={{
                          color: theme.palette.orange.dark,
                          borderColor: theme.palette.orange.main
                        }}
                        size="large"
                        onClick={() => deleteViewerPage(viewerPage?.remoteViewerPageKey)}
                      >
                        <DeleteTwoToneIcon sx={{ fontSize: '1.5rem' }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </MainCard>
);

ManageViewerPagesModal.propTypes = {
  theme: PropTypes.object,
  handleClose: PropTypes.func,
  remoteViewerPages: PropTypes.object,
  editViewerPage: PropTypes.func,
  deleteViewerPage: PropTypes.func
};

export default ManageViewerPagesModal;
