import { useCallback, useEffect, useState } from 'react';

import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import CloseIcon from '@mui/icons-material/Close';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { CardContent, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Stack, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';
import RFLoadingButton from 'ui-component/RFLoadingButton';

import { useDispatch, useSelector } from '../../../store';
import { setShow, startLoginAction } from '../../../store/slices/show';
import { DELETE_ALL_REQUESTS, DELETE_SINGLE_REQUEST } from '../../../utils/graphql/controlPanel/mutations';
import { GET_SHOW } from '../../../utils/graphql/controlPanel/queries';
import { showAlert } from '../../../views/pages/globalPageHelpers';

const ViewJukeboxRequests = ({ handleClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [requests, setRequests] = useState([]);
  const [isDeletingSingleRequest, setIsDeletingSingleRequest] = useState(false);
  const [isDeletingAllRequests, setIsDeletingAllRequests] = useState(false);

  const [getShowQuery] = useLazyQuery(GET_SHOW);
  const [deleteSingleRequestMutation] = useMutation(DELETE_SINGLE_REQUEST);
  const [deleteAllRequestsMutation] = useMutation(DELETE_ALL_REQUESTS);

  const getJukeboxRequests = useCallback(async () => {
    await getShowQuery({
      onCompleted: (data) => {
        setRequests(data?.getShow?.requests);
      },
      onError: () => {
        showAlert(dispatch, { alert: 'error' });
      }
    });
  }, [dispatch, getShowQuery]);

  const deleteSingleRequest = (sequence, position) => {
    setIsDeletingSingleRequest(true);
    deleteSingleRequestMutation({
      variables: {
        sequence,
        position
      },
      onCompleted: () => {
        setIsDeletingSingleRequest(false);
        getJukeboxRequests();
        showAlert(dispatch, { message: `${sequence} Request Deleted` });
      },
      onError: () => {
        setIsDeletingSingleRequest(false);
        showAlert(dispatch, { alert: 'error' });
      }
    }).then();
  };

  const deleteAllRequests = () => {
    setIsDeletingAllRequests(true);
    deleteAllRequestsMutation({
      onCompleted: () => {
        setIsDeletingAllRequests(false);
        getJukeboxRequests();
        showAlert(dispatch, { message: 'All Requests Deleted' });
      },
      onError: () => {
        setIsDeletingAllRequests(false);
        showAlert(dispatch, { alert: 'error' });
      }
    }).then();
  };

  useEffect(() => {
    const init = async () => {
      await getJukeboxRequests();
    };
    init();
  }, [getJukeboxRequests]);

  return (
    <MainCard
      sx={{
        position: 'absolute',
        width: { xs: 450, lg: 800 },
        maxHeight: { xs: 450, lg: 800 },
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        overflowY: 'scroll'
      }}
      title="Jukebox Requests"
      content={false}
      secondary={
        <IconButton onClick={handleClose} size="large">
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      <CardContent>
        <Stack direction="row" justifyContent="right">
          <RFLoadingButton loading={isDeletingAllRequests} color="error" onClick={() => deleteAllRequests()}>
            Delete All Requests
          </RFLoadingButton>
        </Stack>
        <TableContainer>
          <Table sx={{ minWidth: 350 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Position</TableCell>
                <TableCell align="left">Sequence Name</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="sequences">
              {_.map(requests, (request) => (
                <TableRow hover>
                  <TableCell align="left">{request?.position}</TableCell>
                  <TableCell align="left">{request?.sequence?.name}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" alignItems="center">
                      <Tooltip placement="top" title="Delete">
                        <RFLoadingButton
                          loading={isDeletingSingleRequest}
                          onClick={() => deleteSingleRequest(request?.sequence?.name, request?.position)}
                          color="error"
                          variant="text"
                          sx={{
                            color: theme.palette.orange.dark,
                            borderColor: theme.palette.orange.main
                          }}
                        >
                          <DeleteTwoToneIcon sx={{ fontSize: '1.5rem' }} />
                        </RFLoadingButton>
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

ViewJukeboxRequests.propTypes = {
  handleClose: PropTypes.func
};

export default ViewJukeboxRequests;
