import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import LaunchIcon from '@mui/icons-material/Launch';
import { Box, Button, Divider, Drawer, Grid, Typography, Stack, Link } from '@mui/material';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import PerfectScrollbar from 'react-perfect-scrollbar';
import remarkBreaks from 'remark-breaks';

const ViewWorkItem = ({ workItem, coreInfo, open, handleDrawerOpen }) => {
  const createdDateParse = moment(workItem?.created_at, 'YYYY-MM-DDTHH:mm:ss.SSZ').tz(coreInfo?.timezone);
  const commentDateFormatted = `${createdDateParse.format('YYYY-MM-DD HH:mm:ss')}`;

  return (
    <Drawer
      sx={{
        ml: open ? 3 : 0,
        flexShrink: 0,
        zIndex: 1200,
        overflowX: 'hidden',
        width: { xs: 320, md: 450, lg: 650 },
        '& .MuiDrawer-paper': {
          height: '100vh',
          width: { xs: 320, md: 450, lg: 650 },
          position: 'fixed',
          border: 'none',
          borderRadius: '0px'
        }
      }}
      variant="temporary"
      anchor="right"
      open={open}
      ModalProps={{ keepMounted: true }}
      onClose={() => {
        handleDrawerOpen();
      }}
    >
      {open && (
        <>
          <Box sx={{ p: 3 }}>
            <Grid container alignItems="center" spacing={0.5} justifyContent="space-between">
              <Grid item sx={{ width: 'calc(100% - 50px)' }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Button
                    variant="text"
                    color="error"
                    sx={{ p: 0.5, minWidth: 32, display: { xs: 'block', md: 'none' } }}
                    onClick={handleDrawerOpen}
                  >
                    <HighlightOffIcon />
                  </Button>
                  <Typography
                    variant="h3"
                    sx={{
                      display: 'inline-block',
                      width: 'calc(100% - 34px)',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      verticalAlign: 'middle'
                    }}
                  >
                    {workItem?.title}
                  </Typography>
                </Stack>
                <Typography variant="subtitle2" sx={{ ml: 0.5, mt: 1, mb: 1.5 }}>
                  Created on {commentDateFormatted}
                </Typography>
                <Typography
                  sx={{ ml: 0.5 }}
                  variant="h4"
                  noWrap
                  component={Link}
                  onClick={() => window.open(workItem?.html_url, '_blank', 'noreferrer')}
                  color="textPrimary"
                >
                  <Link href="#" underline="none">
                    View on GitHub
                    <Button variant="text" color="primary" sx={{ minWidth: 32 }}>
                      <LaunchIcon />
                    </Button>
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <PerfectScrollbar options={{ wheelPropagation: false }}>
            <Box sx={{ p: 3 }}>
              <Grid container alignItems="center" spacing={0.5} justifyContent="space-between">
                <Grid item sx={{ width: 'calc(100% - 50px)' }}>
                  <ReactMarkdown remarkPlugins={[remarkBreaks]}>{workItem?.body}</ReactMarkdown>
                </Grid>
              </Grid>
            </Box>
          </PerfectScrollbar>
        </>
      )}
    </Drawer>
  );
};

ViewWorkItem.propTypes = {
  open: PropTypes.bool,
  coreInfo: PropTypes.object,
  handleDrawerOpen: PropTypes.func,
  workItem: PropTypes.object
};

export default ViewWorkItem;
