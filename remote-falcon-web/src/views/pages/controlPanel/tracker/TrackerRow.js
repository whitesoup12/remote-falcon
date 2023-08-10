import { useState } from 'react';

import { TableCell, TableRow } from '@mui/material';
import 'react-quill/dist/quill.core.css';
import PropTypes from 'prop-types';

import Chip from 'ui-component/extended/Chip';

import EditWorkItem from './EditWorkItem';

function TrackerRow({ workItem, coreInfo, setIsLoading, fetchWorkItems }) {
  const [editWorkItemDrawerOpen, setEditWorkItemDrawerOpen] = useState(false);

  const handleEditWorkItemDrawer = () => {
    setEditWorkItemDrawerOpen((prevState) => !prevState);
  };

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ pl: 3, minWidth: 10, width: 10 }} />
        <TableCell sx={{ minWidth: 20, width: 20 }}>{workItem?.id}</TableCell>
        <TableCell sx={{ minWidth: 60, width: 60, cursor: 'pointer' }}>
          {workItem?.type === 'Bug' && <Chip label="Bug" size="small" variant="outlined" chipcolor="error" />}
          {workItem?.type === 'User Story' && <Chip label="Feature" size="small" variant="outlined" />}
        </TableCell>
        <TableCell
          onClick={handleEditWorkItemDrawer}
          sx={{ maxWidth: 'calc(100vw - 850px)', minWidth: 140, cursor: 'pointer' }}
          component="th"
          scope="row"
        >
          {workItem?.title}
        </TableCell>
        <TableCell onClick={handleEditWorkItemDrawer} sx={{ pl: 3, minWidth: 60, width: 60, cursor: 'pointer' }}>
          {workItem?.state === 'New' && <Chip label="New" size="small" variant="outlined" />}
          {workItem?.state === 'Active' && <Chip label="Active" size="small" variant="outlined" chipcolor="warning" />}
          {workItem?.state === 'Closed' && <Chip label="Closed" size="small" variant="outlined" chipcolor="success" />}
        </TableCell>
        <TableCell onClick={handleEditWorkItemDrawer} sx={{ pl: 3, minWidth: 60, width: 60, cursor: 'pointer' }}>
          {workItem?.severity === '2 - High' && <Chip label="High" size="small" variant="outlined" chipcolor="error" />}
          {workItem?.severity === '3 - Medium' && <Chip label="Medium" size="small" variant="outlined" chipcolor="warning" />}
          {workItem?.severity === '4 - Low' && <Chip label="Low" size="small" variant="outlined" />}
        </TableCell>
        <TableCell sx={{ minWidth: 60, width: 60 }}>{workItem?.commentCount}</TableCell>
      </TableRow>
      <EditWorkItem
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
