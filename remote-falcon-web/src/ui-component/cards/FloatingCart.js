import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import { Fab, Badge, IconButton } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { sum } from 'lodash';
import { Link } from 'react-router-dom';

import { useSelector } from 'store';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 0,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}));

const FloatingCart = () => {
  const theme = useTheme();
  const cart = useSelector((state) => state.cart);
  const totalQuantity = sum(cart.checkout.products.map((item) => item.quantity));

  return (
    <Fab
      component={Link}
      to="/e-commerce/checkout"
      size="large"
      sx={{
        top: '50%',
        position: 'fixed',
        right: 0,
        zIndex: theme.zIndex.speedDial,
        boxShadow: theme.customShadows.warning,
        bgcolor: 'warning.main',
        color: 'warning.light',
        borderRadius: '8px',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        '&:hover': {
          bgcolor: 'warning.dark',
          color: 'warning.light'
        }
      }}
    >
      <IconButton disableRipple aria-label="cart" sx={{ '&:hover': { bgcolor: 'transparent' } }} size="large">
        <StyledBadge showZero badgeContent={totalQuantity} color="error">
          <ShoppingCartTwoToneIcon sx={{ color: 'grey.800' }} />
        </StyledBadge>
      </IconButton>
    </Fab>
  );
};

export default FloatingCart;
