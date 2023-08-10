import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import PropTypes from 'prop-types';

export default function DeleteStory({ title, open, handleClose, deleteWorkItem }) {
  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      keepMounted
      maxWidth="xs"
      aria-labelledby="item-delete-title"
      aria-describedby="item-delete-description"
    >
      {open && (
        <>
          <DialogTitle id="item-delete-title">Are you sure you want to delete {title}?</DialogTitle>
          <DialogActions sx={{ mr: 2 }}>
            <Button onClick={() => handleClose(false)} color="error">
              Cancel
            </Button>
            <Button variant="contained" size="small" onClick={deleteWorkItem} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

DeleteStory.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  title: PropTypes.string,
  deleteWorkItem: PropTypes.func
};
