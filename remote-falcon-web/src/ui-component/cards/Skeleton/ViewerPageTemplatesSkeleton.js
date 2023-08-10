import { Grid, CardContent, Tabs, Tab } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import PropTypes from 'prop-types';

import { gridSpacing } from 'store/constant';

const ViewerPageTemplatesSkeleton = ({ tabOptions }) => (
  <Grid container spacing={gridSpacing}>
    <Grid item xs={12} lg={4}>
      <CardContent>
        <Tabs
          value={0}
          orientation="vertical"
          variant="scrollable"
          sx={{
            '& .MuiTabs-flexContainer': {
              borderBottom: 'none'
            },
            '& button': {
              minHeight: 'auto',
              minWidth: '100%',
              py: 1.5,
              px: 2,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              textAlign: 'left',
              justifyContent: 'flex-start'
            },
            '& button > svg': {
              marginBottom: '0px !important',
              marginRight: 1.25,
              marginTop: 1.25,
              height: 20,
              width: 20
            },
            '& button > div > span': {
              display: 'block'
            },
            '& > div > span': {
              display: 'none'
            }
          }}
        >
          {tabOptions.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Grid container direction="column">
                  <Skeleton variant="rectangular" height={44} />
                </Grid>
              }
            />
          ))}
        </Tabs>
      </CardContent>
    </Grid>
    <Grid item xs={12} lg={8}>
      <CardContent
        sx={{
          borderLeft: '1px solid',
          height: '100%'
        }}
      >
        <Skeleton variant="rectangular" height={200} />
      </CardContent>
    </Grid>
  </Grid>
);

ViewerPageTemplatesSkeleton.propTypes = {
  tabOptions: PropTypes.array
};

export default ViewerPageTemplatesSkeleton;
