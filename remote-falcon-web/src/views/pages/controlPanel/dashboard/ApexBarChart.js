import React, { useState } from 'react';

import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';

import useConfig from 'hooks/useConfig';

const barChartOptions = {
  chart: {
    type: 'bar',
    height: 350,
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  }
};

const ApexBarChart = ({ ...otherProps }) => {
  const theme = useTheme();
  const { navType } = useConfig();

  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey200;
  const secondary = theme.palette.secondary.main;

  const [options, setOptions] = useState(barChartOptions);

  React.useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [secondary],
      markers: {
        size: 5
      },
      xaxis: {
        labels: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: primary
          }
        }
      },
      grid: {
        borderColor: grey200
      },
      tooltip: {
        followCursor: true,
        theme: navType === 'dark' ? 'dark' : 'light',
        y: {
          formatter(value) {
            return `${otherProps.chartData?.yValue}${value}`;
          },
          title: {
            // eslint-disable-next-line no-unused-vars
            formatter() {
              return '';
            }
          }
        },
        marker: {
          show: false
        }
      }
    }));
  }, [navType, primary, darkLight, grey200, secondary, otherProps.chartData?.yValue]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={[otherProps.chartData]} type="bar" height={350} />
    </div>
  );
};

ApexBarChart.propTypes = {
  chartData: PropTypes.object
};

ApexBarChart.defaultProps = {
  chartData: {}
};

export default ApexBarChart;
