// material-ui
import { createTheme } from '@mui/material/styles';

// assets
import theme1 from 'assets/scss/_theme1.module.scss';
import theme2 from 'assets/scss/_theme2.module.scss';
import theme3 from 'assets/scss/_theme3.module.scss';
import theme4 from 'assets/scss/_theme4.module.scss';
import theme5 from 'assets/scss/_theme5.module.scss';
import theme6 from 'assets/scss/_theme6.module.scss';
import defaultColor from 'assets/scss/_themes-vars.module.scss';

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (navType, presetColor) => {
  let colors;
  switch (presetColor) {
    case 'theme1':
      colors = theme1;
      break;
    case 'theme2':
      colors = theme2;
      break;
    case 'theme3':
      colors = theme3;
      break;
    case 'theme4':
      colors = theme4;
      break;
    case 'theme5':
      colors = theme5;
      break;
    case 'theme6':
      colors = theme6;
      break;
    case 'default':
    default:
      colors = defaultColor;
  }

  return createTheme({
    palette: {
      mode: navType,
      common: {
        black: colors.darkPaper
      },
      primary: {
        light: navType === 'dark' ? colors.darkPrimaryLight : colors.primaryLight,
        main: navType === 'dark' ? colors.darkPrimaryMain : colors.primaryMain,
        dark: navType === 'dark' ? colors.darkPrimaryDark : colors.primaryDark,
        200: navType === 'dark' ? colors.darkPrimary200 : colors.primary200,
        800: navType === 'dark' ? colors.darkPrimary800 : colors.primary800
      },
      secondary: {
        light: navType === 'dark' ? colors.darkSecondaryLight : colors.secondaryLight,
        main: navType === 'dark' ? colors.darkSecondaryMain : colors.secondaryMain,
        dark: navType === 'dark' ? colors.darkSecondaryDark : colors.secondaryDark,
        200: navType === 'dark' ? colors.darkSecondary200 : colors.secondary200,
        800: navType === 'dark' ? colors.darkSecondary800 : colors.secondary800
      },
      error: {
        light: colors.errorLight,
        main: colors.errorMain,
        dark: colors.errorDark
      },
      orange: {
        light: colors.orangeLight,
        main: colors.orangeMain,
        dark: colors.orangeDark
      },
      green: {
        light: colors.greenLight,
        main: colors.greenMain,
        dark: colors.greenDark
      },
      yellow: {
        light: colors.yellowLight,
        main: colors.yellowMain,
        dark: colors.yellowDark
      },
      warning: {
        light: colors.warningLight,
        main: colors.warningMain,
        dark: colors.warningDark
      },
      success: {
        light: colors.successLight,
        200: colors.success200,
        main: colors.successMain,
        dark: colors.successDark
      },
      grey: {
        50: colors.grey50,
        100: colors.grey100,
        500: navType === 'dark' ? colors.darkTextSecondary : colors.grey500,
        600: navType === 'dark' ? colors.darkTextTitle : colors.grey900,
        700: navType === 'dark' ? colors.darkTextPrimary : colors.grey700,
        900: navType === 'dark' ? colors.darkTextPrimary : colors.grey900
      },
      dark: {
        light: colors.darkTextPrimary,
        main: colors.darkLevel1,
        dark: colors.darkLevel2,
        800: colors.darkBackground,
        900: colors.darkPaper
      },
      text: {
        primary: navType === 'dark' ? colors.darkTextPrimary : colors.grey700,
        secondary: navType === 'dark' ? colors.darkTextSecondary : colors.grey500,
        dark: navType === 'dark' ? colors.darkTextPrimary : colors.grey900,
        hint: colors.grey100
      },
      divider: navType === 'dark' ? colors.darkTextPrimary : colors.grey200,
      background: {
        paper: navType === 'dark' ? colors.darkLevel2 : colors.paper,
        default: navType === 'dark' ? colors.darkPaper : colors.paper
      }
    }
  });
};

export default Palette;
