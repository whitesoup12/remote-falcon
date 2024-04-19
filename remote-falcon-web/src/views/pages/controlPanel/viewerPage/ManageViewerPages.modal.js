import { useMutation } from '@apollo/client';
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
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

import { savePagesService } from '../../../../services/controlPanel/mutations.service';
import { useDispatch, useSelector } from '../../../../store';
import { setShow } from '../../../../store/slices/show';
import { UPDATE_PAGES } from '../../../../utils/graphql/controlPanel/mutations';
import { showAlert } from '../../globalPageHelpers';

const ManageViewerPagesModal = ({ setManageViewerPagesOpen, editViewerPage }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.show);

  const [updatePagesMutation] = useMutation(UPDATE_PAGES);

  const deleteViewerPage = (viewerPage) => {
    const updatedPages = _.cloneDeep([...show?.pages]);
    if (viewerPage?.active) {
      showAlert(dispatch, { alert: 'warning', message: 'Cannot delete active page' });
      return;
    }
    _.remove(updatedPages, (page) => page?.name === viewerPage?.name);
    savePagesService(updatedPages, updatePagesMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            pages: [...updatedPages]
          })
        );
        showAlert(dispatch, { message: 'Viewer Page Deleted' });
        setManageViewerPagesOpen(false);
      } else {
        showAlert(dispatch, response?.toast);
        setManageViewerPagesOpen(false);
      }
    });
  };

  const callEditViewerPage = (viewerPage) => {
    setManageViewerPagesOpen(false);
    editViewerPage(viewerPage);
  };

  return (
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
        <IconButton onClick={() => setManageViewerPagesOpen(false)} size="large">
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
              {_.map(show?.pages, (viewerPage) => (
                <TableRow hover>
                  <TableCell align="center">
                    {viewerPage?.active && (
                      <Chip
                        label="Active"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light + 60,
                          color: theme.palette.success.dark
                        }}
                      />
                    )}
                    {!viewerPage?.active && (
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
                  <TableCell align="left">{viewerPage?.name}</TableCell>
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
                          onClick={() => callEditViewerPage(viewerPage)}
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
                          onClick={() => deleteViewerPage(viewerPage)}
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
};

ManageViewerPagesModal.propTypes = {
  setManageViewerPagesOpen: PropTypes.func,
  editViewerPage: PropTypes.func
};

export default ManageViewerPagesModal;
