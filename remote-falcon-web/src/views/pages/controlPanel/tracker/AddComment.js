import { useState } from 'react';

import { Box, Grid, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import useConfig from 'hooks/useConfig';
import { addWorkItemCommentService } from 'services/controlPanel/tracker.service';
import { useDispatch } from 'store';
import RFLoadingButton from 'ui-component/RFLoadingButton';
import { showAlert, mixpanelTrack } from 'views/pages/globalPageHelpers';

const AddComment = ({ coreInfo, workItemId, fetchWorkItems }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { borderRadius } = useConfig();

  const [comment, setComment] = useState('');
  const [isComment, setIsComment] = useState(false);
  const [isCommentSaving, setIsCommentSaving] = useState(false);

  const addNewComment = async () => {
    if (comment.length > 0) {
      setIsCommentSaving(true);
      try {
        const response = await addWorkItemCommentService(workItemId, comment);
        if (response?.status === 200) {
          mixpanelTrack('Work Item Comment', coreInfo);
          showAlert({ dispatch, message: 'Comment Saved' });
        } else {
          showAlert({ dispatch, alert: 'error' });
        }
      } catch {
        showAlert({ dispatch, alert: 'error' });
      }
      setIsCommentSaving(false);
      fetchWorkItems();
      setComment('');
    } else {
      setIsComment(true);
    }
  };

  const handleAddComment = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      addNewComment();
    }
  };

  const handleComment = (event) => {
    const newComment = event.target.value;
    setComment(newComment);
    if (newComment.length <= 0) {
      setIsComment(true);
    } else {
      setIsComment(false);
    }
  };

  return (
    <Box
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary[200] + 75,
        borderRadius: `${borderRadius}px`
      }}
    >
      <Grid container alignItems="center" spacing={0.5}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            placeholder="Add Comment"
            value={comment}
            onChange={handleComment}
            sx={{
              mb: 2,
              '& input': { bgcolor: 'transparent', p: 0, borderRadius: '0px' },
              '& fieldset': { display: 'none' },
              '& .MuiFormHelperText-root': {
                ml: 0
              },
              '& .MuiOutlinedInput-root': {
                bgcolor: 'transparent'
              }
            }}
            onKeyUp={handleAddComment}
            helperText={isComment ? 'Comment is required.' : ''}
            error={isComment}
          />
        </Grid>
        <Grid item xs zeroMinWidth />
        <Grid item>
          <RFLoadingButton loading={isCommentSaving} color="primary" onClick={addNewComment}>
            Comment
          </RFLoadingButton>
        </Grid>
      </Grid>
    </Box>
  );
};

AddComment.propTypes = {
  coreInfo: PropTypes.object,
  workItemId: PropTypes.string,
  fetchWorkItems: PropTypes.func
};

export default AddComment;
