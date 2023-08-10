import { useState } from 'react';

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import GroupTwoToneIcon from '@mui/icons-material/GroupTwoTone';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';
import { Avatar, Button, Card, Grid, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

const avatarImage = require.context('assets/images/profile', true);

const FollowerCard = ({ avatar, follow, location, name }) => {
  const theme = useTheme();
  const avatarProfile = avatar && avatarImage(`./${avatar}`).default;

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
        padding: '16px',
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
          <Grid container spacing={2}>
            <Grid item>
              <Avatar alt="User 1" src={avatarProfile} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography
                variant="h5"
                component="div"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
              >
                {name}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
              >
                <PinDropTwoToneIcon sx={{ mr: '6px', fontSize: '16px', verticalAlign: 'text-top' }} />
                {location}
              </Typography>
            </Grid>
            <Grid item>
              <MoreHorizOutlinedIcon
                fontSize="small"
                sx={{
                  color: theme.palette.primary[200],
                  cursor: 'pointer'
                }}
                aria-controls="menu-followers-card"
                aria-haspopup="true"
                onClick={handleClick}
              />
              <Menu
                id="menu-followers-card"
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
                  Removed
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {follow === 2 ? (
            <Button variant="contained" fullWidth startIcon={<PersonAddTwoToneIcon />}>
              Follow Back
            </Button>
          ) : (
            <Button variant="outlined" fullWidth startIcon={<PeopleAltTwoToneIcon />}>
              Followed
            </Button>
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

FollowerCard.propTypes = {
  avatar: PropTypes.string,
  follow: PropTypes.number,
  location: PropTypes.string,
  name: PropTypes.string
};

export default FollowerCard;
