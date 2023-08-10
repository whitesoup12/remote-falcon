import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';
import { Button, Grid, Tooltip, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { gridSpacing } from 'store/constant';

import Avatar from '../extended/Avatar';

const avatarImage = require.context('assets/images/users', true);

const ListWrapper = styled('div')(({ theme }) => ({
  padding: '15px 0',
  borderBottom: theme.palette.mode === 'dark' ? 'none' : '1px solid',
  borderTop: theme.palette.mode === 'dark' ? 'none' : '1px solid',
  borderColor: `${theme.palette.grey[100]}!important`
}));

const ContactList = ({ avatar, name, role, onActive }) => {
  const theme = useTheme();
  const avatarProfile = avatar && avatarImage(`./${avatar}`).default;

  return (
    <ListWrapper>
      <Grid container alignItems="center" spacing={gridSpacing}>
        <Grid item xs={12} sm={6} onClick={() => onActive && onActive()} style={{ cursor: 'pointer' }}>
          <Grid container alignItems="center" spacing={gridSpacing} sx={{ flexWrap: 'nowrap' }}>
            <Grid item>
              <Avatar alt={name} src={avatarProfile} sx={{ width: 48, height: 48 }} />
            </Grid>
            <Grid item sm zeroMinWidth>
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <Typography variant="h4" component="div">
                    {name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption">{role}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={1} sx={{ justifyContent: 'flex-end', [theme.breakpoints.down('md')]: { justifyContent: 'flex-start' } }}>
            <Grid item>
              <Tooltip placement="top" title="Message">
                <Button variant="outlined" sx={{ minWidth: 32, height: 32, p: 0 }}>
                  <ChatBubbleTwoToneIcon fontSize="small" />
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip placement="top" title="Call">
                <Button variant="outlined" color="secondary" sx={{ minWidth: 32, height: 32, p: 0 }}>
                  <PhoneTwoToneIcon fontSize="small" />
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ListWrapper>
  );
};

ContactList.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  onActive: PropTypes.func,
  role: PropTypes.string
};

export default ContactList;
