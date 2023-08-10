import { useEffect, useRef, useState } from 'react';

import TranslateTwoToneIcon from '@mui/icons-material/TranslateTwoTone';
import {
  Avatar,
  Box,
  ClickAwayListener,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import useConfig from 'hooks/useConfig';
import Transitions from 'ui-component/extended/Transitions';

const LocalizationSection = () => {
  const { borderRadius, locale, onChangeLocale } = useConfig();

  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [language, setLanguage] = useState(locale);

  const handleListItemClick = (event, lng) => {
    setLanguage(lng);
    onChangeLocale(lng);
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

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    setLanguage(locale);
  }, [locale]);

  return (
    <>
      <Box
        sx={{
          ml: 2,
          [theme.breakpoints.down('md')]: {
            ml: 1
          }
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
            background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
            color: theme.palette.primary.dark,
            transition: 'all .2s ease-in-out',
            '&[aria-controls="menu-list-grow"],&:hover': {
              borderColor: theme.palette.primary.main,
              background: theme.palette.primary.main,
              color: theme.palette.primary.light
            }
          }}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          color="inherit"
        >
          {language !== 'en' && (
            <Typography variant="h5" sx={{ textTransform: 'uppercase' }} color="inherit">
              {language}
            </Typography>
          )}
          {language === 'en' && <TranslateTwoToneIcon sx={{ fontSize: '1.3rem' }} />}
        </Avatar>
      </Box>

      <Popper
        placement={matchesXs ? 'bottom-start' : 'bottom'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? 0 : 0, 20]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions position={matchesXs ? 'top-left' : 'top'} in={open} {...TransitionProps}>
              <Paper elevation={16}>
                {open && (
                  <List
                    component="nav"
                    sx={{
                      width: '100%',
                      minWidth: 200,
                      maxWidth: 280,
                      bgcolor: theme.palette.background.paper,
                      borderRadius: `${borderRadius}px`,
                      [theme.breakpoints.down('md')]: {
                        maxWidth: 250
                      }
                    }}
                  >
                    <ListItemButton selected={language === 'en'} onClick={(event) => handleListItemClick(event, 'en')}>
                      <ListItemText
                        primary={
                          <Grid container>
                            <Typography color="textPrimary">English</Typography>
                          </Grid>
                        }
                      />
                    </ListItemButton>
                    <ListItemButton selected={language === 'sp'} onClick={(event) => handleListItemClick(event, 'sp')}>
                      <ListItemText
                        primary={
                          <Grid container>
                            <Typography color="textPrimary">Español</Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                              (Spanish)
                            </Typography>
                          </Grid>
                        }
                      />
                    </ListItemButton>
                  </List>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default LocalizationSection;
