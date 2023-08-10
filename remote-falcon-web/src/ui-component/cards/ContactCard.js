import { useState } from 'react';

import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';
import { Button, Card, Grid, Menu, MenuItem, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { gridSpacing } from 'store/constant';

import Avatar from '../extended/Avatar';

const avatarImage = require.context('assets/images/users', true);

const ContactCard = ({ avatar, contact, email, name, location, onActive, role }) => {
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
        p: 2,
        bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
        border: theme.palette.mode === 'dark' ? 'none' : '1px solid',
        borderColor: theme.palette.grey[100]
      }}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs zeroMinWidth onClick={() => onActive && onActive()} style={{ cursor: 'pointer' }}>
              <Avatar alt={name} size="lg" src={avatarProfile} sx={{ width: 72, height: 72 }} />
            </Grid>
            <Grid item>
              <MoreHorizOutlinedIcon
                fontSize="small"
                sx={{ color: theme.palette.grey[500], cursor: 'pointer' }}
                aria-controls="menu-user-details-card"
                aria-haspopup="true"
                onClick={handleClick}
              />
              <Menu
                id="menu-user-details-card"
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
                <MenuItem onClick={handleClose}> Today</MenuItem>
                <MenuItem onClick={handleClose}> This Month</MenuItem>
                <MenuItem onClick={handleClose}> This Year </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3" component="div">
            {name}
          </Typography>
          <Typography variant="caption">{role}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">Email</Typography>
          <Typography variant="h6">{email}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={6}>
              <Typography variant="caption">Phone</Typography>
              <Typography variant="h6">{contact}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption">Location</Typography>
              <Typography variant="h6">{location}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button variant="outlined" sx={{ width: '100%' }} startIcon={<ChatBubbleTwoToneIcon />}>
                Message
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined" color="secondary" sx={{ width: '100%' }} startIcon={<PhoneTwoToneIcon />}>
                Call
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

ContactCard.propTypes = {
  avatar: PropTypes.string,
  contact: PropTypes.string,
  email: PropTypes.string,
  location: PropTypes.string,
  name: PropTypes.string,
  onActive: PropTypes.func,
  role: PropTypes.string
};

export default ContactCard;
