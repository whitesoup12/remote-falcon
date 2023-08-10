import { useEffect, useRef, useState } from 'react';

import { AppBar, Box, IconButton, ClickAwayListener, Grid, Paper, Popper, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconDotsVertical } from '@tabler/icons';

import Transitions from 'ui-component/extended/Transitions';

import LocalizationSection from '../LocalizationSection';

const MobileSection = () => {
  const theme = useTheme();
  const matchMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Box component="span" ref={anchorRef} sx={{ mt: 1, ml: 1 }}>
        <IconButton
          sx={{ color: theme.palette.mode === 'dark' ? 'primary.main' : 'inherit', ml: 0.5, cursor: 'pointer' }}
          onClick={handleToggle}
        >
          <IconDotsVertical
            stroke={1.5}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            style={{ fontSize: '1.5rem' }}
          />
        </IconButton>
      </Box>

      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ width: '100%', zIndex: 1 }}
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, matchMobile ? 30 : 10]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions type="zoom" in={open} {...TransitionProps} sx={{ transformOrigin: 'top right' }}>
              <Paper>
                {open && (
                  <AppBar
                    color="inherit"
                    sx={{
                      [theme.breakpoints.down('md')]: {
                        background: theme.palette.mode === 'dark' ? theme.palette.dark[800] : '#fff'
                      }
                    }}
                  >
                    <Toolbar sx={{ pt: 2.75, pb: 2.75 }}>
                      <Grid container justifyContent={matchMobile ? 'space-between' : 'flex-end'} alignItems="center">
                        <LocalizationSection />
                      </Grid>
                    </Toolbar>
                  </AppBar>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default MobileSection;
