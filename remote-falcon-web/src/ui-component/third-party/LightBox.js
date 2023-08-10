import PropTypes from 'prop-types';
import Carousel from 'react-images';

const LightBox = ({ currentImage, photos }) => (
  <>
    <Carousel
      currentIndex={currentImage}
      views={photos.map((x) => ({
        ...x,
        srcset: x.srcSet,
        caption: x.title
      }))}
    />
  </>
);

LightBox.propTypes = {
  currentImage: PropTypes.number,
  photos: PropTypes.array
};

export default LightBox;
