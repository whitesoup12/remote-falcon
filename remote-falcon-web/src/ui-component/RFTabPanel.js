import { Grid, Tabs, Tab, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import useConfig from 'hooks/useConfig';
import { useDispatch, useSelector } from 'store';
import { setActiveTab } from 'store/slices/components';

export const RFTabPanel = ({ tabOptions, orientation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { borderRadius } = useConfig();

  const { activeTab } = useSelector((state) => state.components);

  const handleActiveTabChange = (event, activeTab) => {
    dispatch(setActiveTab(activeTab));
  };

  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  });

  return (
    <Tabs
      value={activeTab}
      onChange={handleActiveTabChange}
      orientation={orientation}
      variant="scrollable"
      sx={{
        '& .MuiTabs-flexContainer': {
          borderBottom: 'none'
        },
        '& button': {
          color: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[600],
          minHeight: 'auto',
          minWidth: '100%',
          py: 1.5,
          px: 2,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          textAlign: 'left',
          justifyContent: 'flex-start',
          borderRadius: `${borderRadius}px`
        },
        '& button.Mui-selected': {
          color: theme.palette.primary.main,
          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50]
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
          icon={tab.icon}
          label={
            <Grid container direction="column">
              <Typography variant="subtitle1" color="inherit">
                {tab.label}
              </Typography>
              <Typography component="div" variant="caption">
                {tab.caption}
              </Typography>
            </Grid>
          }
          {...a11yProps(index)}
        />
      ))}
    </Tabs>
  );
};

RFTabPanel.propTypes = {
  tabOptions: PropTypes.array.isRequired,
  orientation: PropTypes.string
};

export const RFTab = ({ children, index, ...other }) => {
  const { activeTab } = useSelector((state) => state.components);
  return (
    <div role="tabpanel" hidden={activeTab !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {activeTab === index && <div>{children}</div>}
    </div>
  );
};

RFTab.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};
