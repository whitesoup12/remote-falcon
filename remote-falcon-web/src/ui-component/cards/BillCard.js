import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const BillCard = ({ primary, secondary, link, color, bg }) => {
  const theme = useTheme();
  return (
    <Card sx={{ borderLeft: '10px solid', borderColor: color, background: bg }}>
      <CardContent>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ color: theme.palette.grey[700] }}>
              {primary}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2" sx={{ fontWeight: 500, mb: 1.5, color: theme.palette.grey[800] }}>
              {secondary}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="text"
              disableElevation
              disableRipple
              component={Link}
              to="#"
              sx={{
                color,
                p: 0,
                '&:hover': { bgcolor: 'transparent' }
              }}
              endIcon={<ArrowRightAltRoundedIcon />}
            >
              {link}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

BillCard.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  link: PropTypes.string,
  color: PropTypes.string,
  bg: PropTypes.string
};

export default BillCard;
