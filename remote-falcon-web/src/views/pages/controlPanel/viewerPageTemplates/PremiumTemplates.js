import { Grid, CardActions, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';

const PremiumTemplates = () => (
  <Grid item xs={12}>
    <MainCard title="Premium Templates" content={false}>
      <CardActions>
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="https://strammade3d.com/collections/remote-falcon-backgrounds" target="_blank">
              <ListItemText primary="Strammade 3D" sx={{ textDecoration: 'underline' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </CardActions>
    </MainCard>
  </Grid>
);

PremiumTemplates.propTypes = {};

export default PremiumTemplates;
