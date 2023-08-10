import CloseIcon from '@mui/icons-material/Close';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { CardContent, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Stack, Tooltip } from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';
import RFLoadingButton from 'ui-component/RFLoadingButton';

const ViewJukeboxRequests = ({ theme, handleClose, jukeboxRequests, deleteJukeboxRequest, purgeQueue, isDeleting, isPurging }) => (
  <MainCard
    sx={{
      position: 'absolute',
      width: { xs: 450, lg: 800 },
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
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
        <RFLoadingButton loading={isPurging} color="error" onClick={() => purgeQueue()}>
          Delete All Requests
        </RFLoadingButton>
      </Stack>
      <TableContainer>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Order</TableCell>
              <TableCell align="left">Sequence Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="sequences">
            {_.map(jukeboxRequests, (request, index) => (
              <TableRow hover>
                <TableCell align="left">{parseInt(index, 10) + 1}</TableCell>
                <TableCell align="left">{request?.sequence}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" justifyContent="center" alignItems="center">
                    <Tooltip placement="top" title="Delete">
                      <RFLoadingButton
                        loading={isDeleting}
                        onClick={() => deleteJukeboxRequest(request?.remoteJukeKey, request?.sequence)}
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

ViewJukeboxRequests.propTypes = {
  theme: PropTypes.object,
  handleClose: PropTypes.func,
  jukeboxRequests: PropTypes.object,
  deleteJukeboxRequest: PropTypes.func,
  purgeQueue: PropTypes.func,
  isDeleting: PropTypes.bool,
  isPurging: PropTypes.bool
};

export default ViewJukeboxRequests;
