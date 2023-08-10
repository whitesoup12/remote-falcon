import { useState } from 'react';

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import StarBorderTwoToneIcon from '@mui/icons-material/StarBorderTwoTone';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Divider, Grid, Menu, MenuItem, Rating, Stack, Tooltip, Typography } from '@mui/material';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import Avatar from '../extended/Avatar';

const avatarImage = require.context('assets/images/profile', true);

const ProductReview = ({ avatar, date, name, status, rating, review }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={3} xl={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={name} src={avatar && avatarImage(`./${avatar}`).default} />
          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="subtitle1" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                {name}
              </Typography>
              {status && (
                <Tooltip title="Purchased Verified">
                  <VerifiedUserIcon fontSize="small" sx={{ color: 'success.dark' }} />
                </Tooltip>
              )}
              {!status && (
                <Tooltip title="Goodwill">
                  <DirectionsRunIcon fontSize="small" sx={{ color: 'error.main' }} />
                </Tooltip>
              )}
            </Stack>
            <Typography variant="caption">{format(new Date(date), 'E, MMM d yyyy')}</Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12} md={8} lg={9} xl={10}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={11}>
            <Stack spacing={1}>
              <Rating
                size="small"
                name="simple-controlled"
                value={rating < 4 ? rating + 1 : rating}
                icon={<StarTwoToneIcon fontSize="inherit" />}
                emptyIcon={<StarBorderTwoToneIcon fontSize="inherit" />}
                precision={0.1}
                readOnly
              />
              <Typography variant="body2">{review}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={1}>
            <Stack justifyContent="flex-end">
              <MoreHorizOutlinedIcon
                fontSize="small"
                aria-controls="menu-popular-card"
                aria-haspopup="true"
                onClick={handleClick}
                sx={{ color: 'grey.500', cursor: 'pointer' }}
              />
              <Menu
                id="menu-popular-card"
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
                <MenuItem onClick={handleClose}> Edit</MenuItem>
                <MenuItem onClick={handleClose}> Delete</MenuItem>
              </Menu>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );
};

ProductReview.propTypes = {
  avatar: PropTypes.string,
  date: PropTypes.string,
  name: PropTypes.string,
  status: PropTypes.bool,
  rating: PropTypes.number,
  review: PropTypes.string
};

export default ProductReview;
