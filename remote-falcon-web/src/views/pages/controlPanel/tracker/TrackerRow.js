import { useState } from 'react';

import { TableCell, TableRow } from '@mui/material';
import 'react-quill/dist/quill.core.css';
import PropTypes from 'prop-types';

import Chip from 'ui-component/extended/Chip';

import ViewWorkItem from './ViewWorkItem';

function TrackerRow({ workItem, coreInfo, setIsLoading, fetchWorkItems }) {
  const [editWorkItemDrawerOpen, setEditWorkItemDrawerOpen] = useState(false);

  const handleEditWorkItemDrawer = () => {
    setEditWorkItemDrawerOpen((prevState) => !prevState);
  };

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ pl: 3, minWidth: 10, width: 10 }} />
        <TableCell sx={{ minWidth: 20, width: 20 }}>{workItem?.number}</TableCell>
        <TableCell sx={{ minWidth: 60, width: 60, cursor: 'pointer' }}>
          {workItem?.type === 'bug' && <Chip label="Bug" size="small" variant="outlined" chipcolor="error" />}
          {workItem?.type === 'enhancement' && <Chip label="Feature" size="small" variant="outlined" />}
        </TableCell>
        <TableCell
          onClick={handleEditWorkItemDrawer}
          sx={{ maxWidth: 'calc(100vw - 850px)', minWidth: 140, cursor: 'pointer' }}
          component="th"
          scope="row"
        >
          {workItem?.title}
        </TableCell>
      </TableRow>
      <ViewWorkItem
        workItem={workItem}
        coreInfo={coreInfo}
        open={editWorkItemDrawerOpen}
        handleDrawerOpen={handleEditWorkItemDrawer}
        setIsLoading={setIsLoading}
        fetchWorkItems={fetchWorkItems}
      />
    </>
  );
}

TrackerRow.propTypes = {
  workItem: PropTypes.object,
  coreInfo: PropTypes.object,
  setIsLoading: PropTypes.func,
  fetchWorkItems: PropTypes.func
};

export default TrackerRow;
