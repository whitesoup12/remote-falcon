import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import ReplyTwoToneIcon from '@mui/icons-material/ReplyTwoTone';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import {
  Box,
  Button,
  ButtonBase,
  Card,
  Collapse,
  FormHelperText,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import uniqueId from 'lodash/uniqueId';
import PropTypes from 'prop-types';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import * as yup from 'yup';

import AnimateButton from 'ui-component/extended/AnimateButton';
import Avatar from 'ui-component/extended/Avatar';

import Reply from './Reply';

const avatarImage = require.context('assets/images/profile', true);

const validationSchema = yup.object().shape({
  name: yup.string().required('Reply Field is Required')
});

const FormInput = ({ bug, label, name, required, ...others }) => {
  const { control } = useFormContext();

  let isError = false;
  let errorMessage = '';
  if (bug && Object.prototype.hasOwnProperty.call(bug, name)) {
    isError = true;
    errorMessage = bug[name].message;
  }

  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            fullWidth
            label={label}
            InputLabelProps={{
              className: required ? 'required-label' : '',
              required: required || false
            }}
            error={isError}
            {...field}
          />
        )}
        {...others}
      />
      {errorMessage && (
        <Grid item xs={12}>
          <FormHelperText error>{errorMessage}</FormHelperText>
        </Grid>
      )}
    </>
  );
};

FormInput.propTypes = {
  bug: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool
};

// ==============================|| SOCIAL PROFILE - COMMENT ||============================== //

const Comment = ({ comment, handleCommentLikes, handleReplayLikes, postId, replyAdd, user }) => {
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openReply, setOpenReply] = useState(false);
  const handleChangeReply = () => {
    setOpenReply((prev) => !prev);
  };

  let repliesResult = <></>;
  if (Object.keys(comment).length > 0 && comment.data?.replies && comment.data?.replies.length) {
    repliesResult = comment.data?.replies.map((reply, index) => (
      <Reply
        postId={postId}
        commentId={comment.id}
        key={index}
        onReply={handleChangeReply}
        reply={reply}
        handleReplayLikes={handleReplayLikes}
      />
    ));
  }

  const methods = useForm({
    resolver: yupResolver(validationSchema)
  });

  const {
    handleSubmit,
    formState: { errors },
    reset
  } = methods;
  const onSubmit = async (reply) => {
    handleChangeReply();
    const replyId = uniqueId('#REPLY_');
    const newReply = {
      id: replyId,
      profile: user,
      data: {
        comment: reply.name,
        likes: {
          like: false,
          value: 0
        },
        replies: []
      }
    };

    replyAdd(postId, comment.id, newReply);
    reset({ name: '' });
  };

  return (
    <>
      {Object.keys(comment).length > 0 && (
        <Grid item xs={12}>
          <Card
            sx={{
              background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
              padding: '16px 16px 8px',
              mt: 1.25
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid container wrap="nowrap" alignItems="center" spacing={1}>
                  <Grid item>
                    <Avatar
                      sx={{ width: 24, height: 24 }}
                      size="sm"
                      alt="User 1"
                      src={comment.profile && comment.profile.avatar && avatarImage(`./${comment.profile.avatar}`).default}
                    />
                  </Grid>
                  <Grid item xs zeroMinWidth>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <Typography align="left" variant="h5" component="div">
                          {comment.profile.name}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography align="left" variant="caption">
                          <FiberManualRecordIcon sx={{ width: '10px', height: '10px', opacity: 0.5, m: '0 5px' }} /> {comment.profile.time}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <ButtonBase sx={{ borderRadius: '12px' }}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...theme.typography.commonAvatar,
                          ...theme.typography.smallAvatar,
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                          color: theme.palette.mode === 'dark' ? theme.palette.dark.light : theme.palette.secondary.dark,
                          zIndex: 1,
                          transition: 'all .2s ease-in-out',
                          '&[aria-controls="menu-list-grow"],&:hover': {
                            background: theme.palette.secondary.main,
                            color: theme.palette.secondary.light
                          }
                        }}
                        aria-controls="menu-comment"
                        aria-haspopup="true"
                        onClick={handleClick}
                      >
                        <MoreVertTwoToneIcon fontSize="inherit" />
                      </Avatar>
                    </ButtonBase>
                    <Menu
                      id="menu-comment"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                    >
                      <MenuItem onClick={handleClose}>Edit</MenuItem>
                      <MenuItem onClick={handleClose}>Delete</MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ '&.MuiGrid-root': { pt: 1.5 } }}>
                <Typography align="left" variant="body2">
                  {comment.data?.comment}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} sx={{ color: theme.palette.mode === 'dark' ? 'grey.700' : 'grey.800' }}>
                  <Button
                    onClick={() => handleCommentLikes(postId, comment.id)}
                    variant="text"
                    color="inherit"
                    size="small"
                    startIcon={<ThumbUpAltTwoToneIcon color={comment.data?.likes && comment.data?.likes.like ? 'secondary' : 'inherit'} />}
                  >
                    {comment.data?.likes && comment.data?.likes.value ? comment.data?.likes.value : 0} likes
                  </Button>
                  <Button
                    variant="text"
                    onClick={handleChangeReply}
                    color="inherit"
                    size="small"
                    startIcon={<ReplyTwoToneIcon color="primary" />}
                  >
                    {comment.data?.replies ? comment.data?.replies.length : 0} reply
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      )}
      {repliesResult}
      {/* comment - add new replay */}
      <Collapse in={openReply} sx={{ width: '100%' }}>
        {openReply && (
          <Grid item xs={12} sx={{ pl: { xs: 1, sm: 3 }, pt: 3 }}>
            <Box
              sx={{
                ml: 4.25,
                [theme.breakpoints.down('md')]: {
                  ml: 0
                }
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Avatar
                      sx={{ mt: 1.5 }}
                      alt="User 1"
                      src={comment.profile && comment.profile.avatar && avatarImage(`./${comment.profile.avatar}`).default}
                    />
                  </Grid>
                  <Grid item xs zeroMinWidth sx={{ mt: 1 }}>
                    <FormProvider {...methods}>
                      <FormInput
                        fullWidth
                        name="name"
                        label="Write a reply..."
                        size={matchesXS ? 'small' : 'medium'}
                        bug={errors}
                        InputProps={{
                          label: 'Write a reply...',
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachmentRoundedIcon fontSize="small" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </FormProvider>
                  </Grid>
                  <Grid item>
                    <AnimateButton>
                      <Button type="submit" variant="contained" color="secondary" size={matchesXS ? 'small' : 'large'} sx={{ mt: 1.5 }}>
                        Reply
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Grid>
        )}
      </Collapse>
    </>
  );
};

Comment.propTypes = {
  comment: PropTypes.object,
  postId: PropTypes.string,
  user: PropTypes.object,
  commentAdd: PropTypes.func,
  handleCommentLikes: PropTypes.func,
  handlePostLikes: PropTypes.func,
  handleReplayLikes: PropTypes.func,
  post: PropTypes.object,
  replyAdd: PropTypes.func
};

export default Comment;
