import * as React from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

const options = ['Delete Inactive Sequences', 'Delete All Sequences'];

const RFSplitButton = ({ disabled, onClick, color, variant, sx }) => {
  const theme = useTheme();

  let background = theme.palette.primary.main;
  let backgroundHover = theme.palette.primary.dark;
  if (color === 'error') {
    background = theme.palette.error.main;
    backgroundHover = theme.palette.error.dark;
  }

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <Button
          sx={sx || { background, '&:hover': { background: backgroundHover } }}
          disabled={disabled}
          variant={variant || 'contained'}
          size="large"
          onClick={() => onClick(options, selectedIndex)}
        >
          {options[selectedIndex]}
        </Button>
        <Button
          sx={sx || { background, '&:hover': { background: backgroundHover } }}
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select delete"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

RFSplitButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.string,
  variant: PropTypes.string,
  sx: PropTypes.object,
  callback: PropTypes.func
};

export default RFSplitButton;
