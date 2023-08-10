import CloseIcon from '@mui/icons-material/Close';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { CardContent, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Stack, Tooltip } from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

const ManageSequenceGroups = ({ theme, handleClose, sequenceGroups, deleteSequenceGroup }) => (
  <MainCard
    sx={{
      position: 'absolute',
      width: { xs: 450, lg: 800 },
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}
    title="Manage Sequence Groups"
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
              <TableCell align="left">Sequence Group Name</TableCell>
              <TableCell align="left">Sequences In Group</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="sequences">
            {_.map(sequenceGroups, (group) => (
              <TableRow hover>
                <TableCell align="left">{group?.sequenceGroupName}</TableCell>
                <TableCell align="left">
                  {_.map(group?.sequenceNamesInGroup, (sequenceInGroup, index) => {
                    const value = `${index + 1}: ${sequenceInGroup}`;
                    return (
                      <>
                        {value}
                        <br />
                      </>
                    );
                  })}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" justifyContent="center" alignItems="center">
                    <Tooltip placement="top" title="Delete">
                      <IconButton
                        color="primary"
                        sx={{
                          color: theme.palette.orange.dark,
                          borderColor: theme.palette.orange.main
                        }}
                        size="large"
                        onClick={() => deleteSequenceGroup(group?.sequenceGroupKey, group?.sequenceGroupName)}
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

ManageSequenceGroups.propTypes = {
  theme: PropTypes.object,
  handleClose: PropTypes.func,
  sequenceGroups: PropTypes.array,
  deleteSequenceGroup: PropTypes.func
};

export default ManageSequenceGroups;
