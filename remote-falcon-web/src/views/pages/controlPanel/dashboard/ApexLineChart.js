import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';

import useConfig from 'hooks/useConfig';

const lineChartOptions = {
  chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    type: 'datetime'
  }
};

const ApexLineChart = ({ ...otherProps }) => {
  const theme = useTheme();
  const { navType } = useConfig();

  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey200;
  const secondary = theme.palette.secondary.main;

  const [options, setOptions] = useState(lineChartOptions);

  const tootlipYFormatter = (seriesLabels) => {
    let title = '';
    if (seriesLabels) {
      _.forEach(seriesLabels, (seriesLabel) => {
        title += `${seriesLabel.label}${seriesLabel.value}`;
      });
      title += '<br/>';
    }
    return title;
  };

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [secondary],
      markers: {
        size: 5
      },
      xaxis: {
        labels: {
          style: {
            colors: primary
          }
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
            formatter(value, { series, seriesIndex, dataPointIndex, w }) {
              return tootlipYFormatter(_.nth(otherProps.chartData?.seriesLabels, dataPointIndex));
            }
          }
        },
        marker: {
          show: false
        }
      }
    }));
  }, [darkLight, grey200, navType, otherProps.chartData?.seriesLabels, otherProps.chartData?.yValue, primary, secondary]);
  return (
    <div id="chart">
      <ReactApexChart options={options} series={[otherProps.chartData]} type="line" height={350} />
    </div>
  );
};

ApexLineChart.propTypes = {
  chartData: PropTypes.object
};

ApexLineChart.defaultProps = {
  chartData: {}
};

export default ApexLineChart;
