import { Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { gridSpacing } from 'store/constant';

const UserProfileSkeleton = () => (
  <Grid container spacing={gridSpacing}>
    <Grid item xs={12}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Skeleton variant="circular" height={80} width={80} />
        </Grid>
        <Grid item sm zeroMinWidth>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={20} width={250} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Skeleton variant="rectangular" height={50} />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Skeleton variant="rectangular" height={50} />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Skeleton variant="rectangular" height={50} />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Skeleton variant="rectangular" height={50} />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Skeleton variant="rectangular" height={45} width={150} />
    </Grid>
  </Grid>
);

export default UserProfileSkeleton;
