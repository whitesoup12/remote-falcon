// material-ui
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

const DashboardChartsSkeleton = () => (
  <Grid item xs={12} md={6} lg={6}>
    <Card>
      <CardHeader title={<Skeleton variant="rectangular" height={42} />} />
      <CardContent>
        <Skeleton variant="rectangular" height={350} />
      </CardContent>
    </Card>
  </Grid>
);

export default DashboardChartsSkeleton;
