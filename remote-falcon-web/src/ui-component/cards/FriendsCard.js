import { useState } from 'react';

import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import GroupTwoToneIcon from '@mui/icons-material/GroupTwoTone';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';
import VideoCallTwoToneIcon from '@mui/icons-material/VideoCallTwoTone';
import { Avatar, Button, Card, Grid, IconButton, ListItemIcon, Menu, MenuItem, Typography, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { gridSpacing } from 'store/constant';

const avatarImage = require.context('assets/images/profile', true);

const FriendsCard = ({ avatar, location, name }) => {
  const theme = useTheme();

  const avatarProfile = avatar && avatarImage(`./${avatar}`).default;

  const btnSX = {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[200],
    background: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.background.paper
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      sx={{
        p: 2,
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[100],
        '&:hover': {
          border: `1px solid${theme.palette.primary.main}`
        }
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item>
              <Avatar alt="User 1" src={avatarProfile} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography variant="h5" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                {name}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
              >
                <PinDropTwoToneIcon fontSize="inherit" sx={{ mr: 0.5, fontSize: '0.875rem', verticalAlign: 'text-top' }} />
                {location}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton size="small" sx={{ mt: -0.75, mr: -0.75 }} onClick={handleClick}>
                <MoreHorizOutlinedIcon
                  fontSize="small"
                  aria-controls="menu-friend-card"
                  aria-haspopup="true"
                  color="primary"
                  sx={{ opacity: 0.6 }}
                />
              </IconButton>
              <Menu
                id="menu-friend-card"
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
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <FavoriteTwoToneIcon fontSize="small" />
                  </ListItemIcon>
                  Favorites
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <GroupTwoToneIcon fontSize="small" />
                  </ListItemIcon>
                  Edit Friend List
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <DeleteTwoToneIcon fontSize="small" />
                  </ListItemIcon>
                  Unfriend
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Tooltip title="Video Call" placement="top">
                <Button variant="outlined" color="secondary" fullWidth sx={btnSX}>
                  <VideoCallTwoToneIcon fontSize="small" />
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={6}>
              <Tooltip title="Message" placement="top">
                <Button variant="outlined" fullWidth sx={btnSX}>
                  <ChatBubbleTwoToneIcon fontSize="small" />
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

FriendsCard.propTypes = {
  avatar: PropTypes.string,
  location: PropTypes.string,
  name: PropTypes.string
};

export default FriendsCard;
