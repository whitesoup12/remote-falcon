// material-ui
import { Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

const ViewerPageEditorSkeleton = () => (
  <Grid item xs={12} md={12} lg={12}>
    <Skeleton variant="rectangular" height="65vh" />
  </Grid>
);

export default ViewerPageEditorSkeleton;
