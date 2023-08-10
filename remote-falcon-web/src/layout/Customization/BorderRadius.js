import { Grid, Slider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import useConfig from 'hooks/useConfig';
import SubCard from 'ui-component/cards/SubCard';

function valueText(value) {
  return `${value}px`;
}

const BorderRadius = () => {
  const theme = useTheme();
  const { borderRadius, onChangeBorderRadius } = useConfig();

  return (
    <SubCard title="Border Radius">
      <Grid item xs={12} container spacing={2} alignItems="center" sx={{ mt: 2.5 }}>
        <Grid item>
          <Typography variant="h6" color="secondary">
            4px
          </Typography>
        </Grid>
        <Grid item xs>
          <Slider
            size="small"
            value={borderRadius}
            onChange={onChangeBorderRadius}
            getAriaValueText={valueText}
            valueLabelDisplay="on"
            aria-labelledby="discrete-slider-small-steps"
            marks
            step={2}
            min={4}
            max={24}
            color="secondary"
            sx={{
              '& .MuiSlider-valueLabel': {
                color: theme.palette.mode === 'dark' ? 'secondary.dark' : 'secondary.light'
              }
            }}
          />
        </Grid>
        <Grid item>
          <Typography variant="h6" color="secondary">
            24px
          </Typography>
        </Grid>
      </Grid>
    </SubCard>
  );
};

export default BorderRadius;
