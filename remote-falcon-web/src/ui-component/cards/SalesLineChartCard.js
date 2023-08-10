import { Box, Card, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';

const SalesLineChartCard = ({ bgColor, chartData, footerData, icon, title, percentage }) => {
  const theme = useTheme();

  let footerHtml;
  if (footerData) {
    footerHtml = footerData.map((item, index) => (
      <Grid item key={index}>
        <Box
          sx={{
            mt: 3,
            mb: 3,
            p: 1
          }}
        >
          <Grid container direction="column" spacing={1} alignItems="center">
            <Typography variant="h3" sx={{ mb: 1 }}>
              {item.value}
            </Typography>
            <Typography variant="body1">{item.label}</Typography>
          </Grid>
        </Box>
      </Grid>
    ));
  }

  return (
    <Card>
      <Box
        sx={{
          color: '#fff',
          bgcolor: bgColor || theme.palette.primary.dark,
          p: 3
        }}
      >
        <Grid container direction="column" spacing={1}>
          <Grid item container justifyContent="space-between" alignItems="center">
            {title && (
              <Grid item>
                <Typography variant="subtitle1" color="inherit">
                  {title}
                </Typography>
              </Grid>
            )}
            <Grid item>
              <Grid container alignItems="center">
                {icon && (
                  <Box
                    component="span"
                    sx={{
                      mr: 2
                    }}
                  >
                    {icon}
                  </Box>
                )}
                {percentage && (
                  <Typography variant="subtitle1" color="inherit">
                    {percentage}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
          {chartData && (
            <Grid item>
              <Chart {...chartData} />
            </Grid>
          )}
        </Grid>
      </Box>
      {footerData && (
        <Grid container justifyContent="space-around" alignItems="center">
          {footerHtml}
        </Grid>
      )}
    </Card>
  );
};

SalesLineChartCard.propTypes = {
  title: PropTypes.string,
  chartData: PropTypes.object,
  footerData: PropTypes.array,
  dropData: PropTypes.object,
  listData: PropTypes.object,
  bgColor: PropTypes.string,
  icon: PropTypes.element,
  percentage: PropTypes.string
};

export default SalesLineChartCard;
