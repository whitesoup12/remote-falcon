// material-ui
import { Grid, Card, CardContent, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

const DashboardStatsSkeleton = () => (
  <Grid item xs={12} md={6} lg={6}>
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            right: 13,
            top: 23,
            color: '#fff'
          }}
        >
          <Skeleton variant="rectangular" width={80} height={80} />
        </Typography>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" width={150} height={21} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" width={150} height={21} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" width={150} height={21} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </Grid>
);

export default DashboardStatsSkeleton;
