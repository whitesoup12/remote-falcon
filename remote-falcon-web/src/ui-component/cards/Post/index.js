import * as React from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import {
  Button,
  ButtonBase,
  CardMedia,
  Collapse,
  FormHelperText,
  Grid,
  IconButton,
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
import { Controller, FormProvider, useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import * as yup from 'yup';

import useAuth from 'hooks/useAuth';
import useConfig from 'hooks/useConfig';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Avatar from 'ui-component/extended/Avatar';
import ImageList from 'ui-component/extended/ImageList';

import MainCard from '../MainCard';
import Comment from './Comment';

const avatarImage = require.context('assets/images/profile', true);

const validationSchema = yup.object().shape({
  name: yup.string().required('Comment Field is Required')
});

const FormInput = ({ bug, label, size, fullWidth = true, name, required, ...others }) => {
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
        defaultValue=""
        render={({ field }) => (
          <TextField
            fullWidth={fullWidth}
            size={size}
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
  size: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool
};

// ==============================|| SOCIAL PROFILE - POST ||============================== //

const Post = ({ commentAdd, handleCommentLikes, handlePostLikes, handleReplayLikes, post, replyAdd }) => {
  const theme = useTheme();

  const { user } = useAuth();
  const { id, data } = post;
  let { profile } = post;

  profile = { ...profile, name: user?.name || profile.name };

  const { borderRadius } = useConfig();
  const matchesXS = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorSharedEl, setAnchorSharedEl] = React.useState(null);
  const handleSharedClick = (event) => {
    setAnchorSharedEl(event.currentTarget);
  };

  const handleSharedClose = () => {
    setAnchorSharedEl(null);
  };

  const [openComment, setOpenComment] = React.useState(!(data.comments && data.comments.length > 0));
  const handleChangeComment = () => {
    setOpenComment((prev) => !prev);
  };

  let commentsResult = <></>;

  if (data && data.comments) {
    commentsResult = data.comments.map((comment) => (
      <Comment
        postId={id}
        comment={comment}
        key={comment.id}
        user={profile}
        replyAdd={replyAdd}
        handleCommentLikes={handleCommentLikes}
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
  const onSubmit = async (comment) => {
    handleChangeComment();
    const commentId = uniqueId('#COMMENT_');
    const newComment = {
      id: commentId,
      profile,
      data: {
        comment: comment.name,
        likes: {
          like: false,
          value: 0
        },
        replies: []
      }
    };
    commentAdd(id, newComment);
    reset({ name: '' });
  };

  return (
    <MainCard>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container wrap="nowrap" alignItems="center" spacing={1}>
            <Grid item>
              <Avatar alt="User 1" src={profile.avatar && avatarImage(`./${profile.avatar}`).default} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography align="left" variant="h5" component="div">
                    {profile.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography align="left" variant="caption">
                    <FiberManualRecordIcon sx={{ width: '10px', height: '10px', opacity: 0.5, m: '0 5px' }} /> {profile.time}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <ButtonBase sx={{ borderRadius: '12px' }} onClick={handleClick}>
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
                  aria-controls="menu-post"
                  aria-haspopup="true"
                >
                  <MoreVertTwoToneIcon fontSize="inherit" />
                </Avatar>
              </ButtonBase>
              <Menu
                id="menu-post"
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

        {/* post - content */}
        <Grid
          item
          xs={12}
          sx={{
            '& > p': {
              ...theme.typography.body1,
              mb: 0
            }
          }}
        >
          <ReactMarkdown remarkPlugins={[gfm]}>{data.content}</ReactMarkdown>
        </Grid>

        {/* post - photo grid */}
        {data && data.images && data.images.length > 0 && (
          <Grid item xs={12}>
            <ImageList itemData={data.images} />
          </Grid>
        )}

        {/* post - video */}
        {data.video && (
          <Grid item xs={12} sx={{ '&.MuiGrid-root': { pt: 2 } }}>
            <CardMedia
              sx={{
                borderRadius: `${borderRadius}px`,
                height: 330,
                [theme.breakpoints.down('xl')]: {
                  height: 220
                }
              }}
              component="iframe"
              src={`https://www.youtube.com/embed/${data.video}`}
            />
          </Grid>
        )}

        {/* post - comment, likes and replay history */}
        <Grid item xs={12}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ mt: 0, color: theme.palette.mode === 'dark' ? 'grey.700' : 'grey.800' }}
          >
            <Grid item>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="text"
                  onClick={() => handlePostLikes(id)}
                  color="inherit"
                  size="small"
                  startIcon={<ThumbUpAltTwoToneIcon color={data && data.likes && data.likes.like ? 'primary' : 'inherit'} />}
                >
                  {data && data.likes && data.likes.value ? data.likes.value : 0}
                  <Typography color="inherit" sx={{ fontWeight: 500, ml: 0.5, display: { xs: 'none', sm: 'block' } }}>
                    likes
                  </Typography>
                </Button>
                <Button
                  onClick={handleChangeComment}
                  size="small"
                  variant="text"
                  color="inherit"
                  startIcon={<ChatBubbleTwoToneIcon color="secondary" />}
                >
                  {data.comments ? data.comments.length : 0} comments
                </Button>
              </Stack>
            </Grid>
            <Grid item>
              <IconButton onClick={handleSharedClick} size="large">
                <ShareTwoToneIcon sx={{ width: '16px', height: '16px' }} />
              </IconButton>
              <Menu
                id="menu-post"
                anchorEl={anchorSharedEl}
                keepMounted
                open={Boolean(anchorSharedEl)}
                onClose={handleSharedClose}
                variant="selectedMenu"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                sx={{
                  '& .MuiSvgIcon-root': {
                    marginRight: '14px',
                    fontSize: '1.25rem'
                  }
                }}
              >
                <MenuItem onClick={handleSharedClose}>
                  <ShareTwoToneIcon fontSize="inherit" /> Share Now
                </MenuItem>
                <MenuItem onClick={handleSharedClose}>
                  <PeopleAltTwoToneIcon fontSize="inherit" /> Share to Friends
                </MenuItem>
                <MenuItem onClick={handleSharedClose}>
                  <ChatTwoToneIcon fontSize="inherit" /> Send in Messanger
                </MenuItem>
                <MenuItem onClick={handleSharedClose}>
                  <ContentCopyTwoToneIcon fontSize="inherit" /> Copy Link
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>
        {/* add new comment */}
        <Collapse in={openComment} sx={{ width: '100%' }}>
          {openComment && (
            <Grid item xs={12} sx={{ pt: 2 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Avatar sx={{ mt: 0.75 }} alt="User 1" src={profile.avatar && avatarImage(`./${profile.avatar}`).default} size="xs" />
                  </Grid>
                  <Grid item xs zeroMinWidth>
                    <FormProvider {...methods}>
                      <FormInput fullWidth name="name" label="Write a comment..." size={matchesXS ? 'small' : 'medium'} bug={errors} />
                    </FormProvider>
                  </Grid>
                  <Grid item>
                    <AnimateButton>
                      <Button type="submit" variant="contained" color="secondary" size={matchesXS ? 'small' : 'large'} sx={{ mt: 0.5 }}>
                        Comment
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          )}
        </Collapse>
        {commentsResult}
      </Grid>
    </MainCard>
  );
};

Post.propTypes = {
  commentAdd: PropTypes.func,
  handleCommentLikes: PropTypes.func,
  handlePostLikes: PropTypes.func,
  handleReplayLikes: PropTypes.func,
  post: PropTypes.object,
  replyAdd: PropTypes.func
};

export default Post;
