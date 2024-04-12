import { Box, Grid } from '@mui/material';

import { gridSpacing } from 'store/constant';

import DashboardCharts from './DashboardCharts';
import DashboardHeader from './DashboardHeader';

const Dashboard = () => (
  <Box sx={{ mt: 2 }}>
    <Grid container spacing={gridSpacing}>
      <DashboardHeader />
      <DashboardCharts />
    </Grid>
  </Box>
);

export default Dashboard;
