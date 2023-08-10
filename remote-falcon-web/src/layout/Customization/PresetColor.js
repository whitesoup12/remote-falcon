import { Avatar, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconChecks } from '@tabler/icons';
import PropTypes from 'prop-types';

import theme1 from 'assets/scss/_theme1.module.scss';
import theme2 from 'assets/scss/_theme2.module.scss';
import theme3 from 'assets/scss/_theme3.module.scss';
import theme4 from 'assets/scss/_theme4.module.scss';
import theme5 from 'assets/scss/_theme5.module.scss';
import theme6 from 'assets/scss/_theme6.module.scss';
import colors from 'assets/scss/_themes-vars.module.scss';
import useConfig from 'hooks/useConfig';
import SubCard from 'ui-component/cards/SubCard';

const PresetColorBox = ({ color, presetColor, setPresetColor }) => (
  <Grid item>
    <Avatar
      variant="rounded"
      color="inherit"
      sx={{
        background: `linear-gradient(135deg, ${color.primary} 50%, ${color.secondary} 50%)`,
        opacity: presetColor === color.id ? 0.6 : 1,
        cursor: 'pointer'
      }}
      onClick={() => setPresetColor(color?.id)}
    >
      {presetColor === color.id && <IconChecks color="#fff" />}
    </Avatar>
  </Grid>
);

PresetColorBox.propTypes = {
  color: PropTypes.shape({
    id: PropTypes.string,
    primary: PropTypes.string,
    secondary: PropTypes.string
  }),
  presetColor: PropTypes.string,
  setPresetColor: PropTypes.func
};

const PresetColor = () => {
  const theme = useTheme();
  const { presetColor, onChangePresetColor } = useConfig();

  const colorOptions = [
    {
      id: 'default',
      primary: theme.palette.mode === 'dark' ? colors.darkPrimaryMain : colors.primaryMain,
      secondary: theme.palette.mode === 'dark' ? colors.darkSecondaryMain : colors.secondaryMain
    },
    {
      id: 'theme1',
      primary: theme.palette.mode === 'dark' ? theme1.darkPrimaryMain : theme1.primaryMain,
      secondary: theme.palette.mode === 'dark' ? theme1.darkSecondaryMain : theme1.secondaryMain
    },
    {
      id: 'theme2',
      primary: theme.palette.mode === 'dark' ? theme2.darkPrimaryMain : theme2.primaryMain,
      secondary: theme.palette.mode === 'dark' ? theme2.darkSecondaryMain : theme2.secondaryMain
    },
    {
      id: 'theme3',
      primary: theme.palette.mode === 'dark' ? theme3.darkPrimaryMain : theme3.primaryMain,
      secondary: theme.palette.mode === 'dark' ? theme3.darkSecondaryMain : theme3.secondaryMain
    },
    {
      id: 'theme4',
      primary: theme.palette.mode === 'dark' ? theme4.darkPrimaryMain : theme4.primaryMain,
      secondary: theme.palette.mode === 'dark' ? theme4.darkSecondaryMain : theme4.secondaryMain
    },
    {
      id: 'theme5',
      primary: theme.palette.mode === 'dark' ? theme5.darkPrimaryMain : theme5.primaryMain,
      secondary: theme.palette.mode === 'dark' ? theme5.darkSecondaryMain : theme5.secondaryMain
    },
    {
      id: 'theme6',
      primary: theme.palette.mode === 'dark' ? theme6.darkPrimaryMain : theme6.primaryMain,
      secondary: theme.palette.mode === 'dark' ? theme6.darkSecondaryMain : theme6.secondaryMain
    }
  ];

  return (
    <SubCard title="Color Theme">
      <Grid item container spacing={2} alignItems="center">
        {colorOptions.map((color, index) => (
          <PresetColorBox key={index} color={color} presetColor={presetColor} setPresetColor={onChangePresetColor} />
        ))}
      </Grid>
    </SubCard>
  );
};

export default PresetColor;
