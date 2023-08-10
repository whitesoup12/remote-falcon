import { useState } from 'react';

import { Drawer, Fab, Grid, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconSettings } from '@tabler/icons';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

import FontFamily from './FontFamily';
import Layout from './Layout';
import PresetColor from './PresetColor';

const Customization = () => {
  const theme = useTheme();

  // drawer on/off
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* toggle button */}
      <Tooltip title="Customize">
        <Fab
          component="div"
          onClick={handleToggle}
          size="small"
          variant="circular"
          color="secondary"
          sx={{
            borderRadius: 0,
            borderTopLeftRadius: '50%',
            borderBottomLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomRightRadius: '4px',
            top: '25%',
            right: 10,
            zIndex: theme.zIndex.speedDial,
            boxShadow: theme.customShadows.secondary
          }}
        >
          <AnimateButton type="rotate">
            <IconButton color="inherit" size="large" disableRipple>
              <IconSettings />
            </IconButton>
          </AnimateButton>
        </Fab>
      </Tooltip>

      <Drawer
        anchor="right"
        onClose={handleToggle}
        open={open}
        PaperProps={{
          sx: {
            width: 280
          }
        }}
      >
        {open && (
          <PerfectScrollbar component="div">
            <Grid container spacing={gridSpacing} sx={{ p: 3 }}>
              <Grid item xs={12}>
                {/* layout type */}
                <Layout />
              </Grid>
              <Grid item xs={12}>
                {/* Theme Preset Color */}
                <PresetColor />
              </Grid>
              <Grid item xs={12}>
                {/* font family */}
                <FontFamily />
              </Grid>
              <Grid item xs={12}>
                {/* border radius */}
                {/* <BorderRadius /> */}
              </Grid>
              <Grid item xs={12}>
                {/* filled with outline textfield */}
                {/* <InputFilled /> */}
              </Grid>
              <Grid item xs={12}>
                {/* box container */}
                {/* <BoxContainer /> */}
              </Grid>
            </Grid>
          </PerfectScrollbar>
        )}
      </Drawer>
    </>
  );
};

export default Customization;
