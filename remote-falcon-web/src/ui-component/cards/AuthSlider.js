import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Slider from 'react-slick';

const AuthSlider = ({ items }) => {
  const settings = {
    autoplay: true,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Slider {...settings}>
      {items.map((item, i) => (
        <Grid key={i} container direction="column" alignItems="center" spacing={3} textAlign="center">
          <Grid item>
            <Typography variant="h1">{item.title}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle2">{item.description}</Typography>
          </Grid>
        </Grid>
      ))}
    </Slider>
  );
};

AuthSlider.propTypes = {
  items: PropTypes.array.isRequired
};

export default AuthSlider;
