import { createMuiTheme } from '@material-ui/core/styles';
import { MicNone } from '@material-ui/icons';

// https://material-ui.com/customization/palette/
// https://material-ui.com/customization/default-theme/
const theme = createMuiTheme({
  palette: {
    primary: {
      light: `#d8eded`,
      main: `#54bbab`,
      dark: `#369283`,
    },
    secondary: {
      light: `#f6dfe1`,
      main: `#e62336`,
      dark: `#e62336`,
    },
    error: {
      light: `#f6dfe1`,
      main: `#e62336`,
      dark: `#e62336`,
    },
    action: {
      active: `#d8d8d8`, // rood
      hover: `#d8eded`, // geel
      selected: `#d8eded`,
    },
    background: {
      default: '#fff',
    },
  },
  // shadows: ['none'],
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontWeightRegular: 300,
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 25.6,
    button: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 300,
      textTransform: 'capitalize',
      fontSize: '1.6rem',
    },
    overline: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 300,
      textTransform: 'capitalize',
      fontSize: '1.6rem',
    },
    body1: { lineHeight: 1.8, fontSize: '1.5rem', color: `#0c1424` },
    body2: { lineHeight: 1.8, fontSize: '1.5rem', color: `#0c1424` },
  },
  overrides: {
    MuiButton: {
      root: {
        '&:hover': {
          backgroundColor: 'none',
        },
      },
    },
    MuiPaper: {
      elevation8: {
        boxShadow: '0 0px 80px rgba(0, 0, 0, 0.07)',
        marginTop: '7rem',
        borderRadius: '0.3rem',
        marginLeft: '-2rem',
        // border: '0.1rem solid black',
      },
    },
    // Tab elementen
    MuiTab: {
      root: {
        padding: '0.6rem 0.4rem',
        marginRight: '3rem',
        '&:last-of-type': {
          marginRight: '0',
        },
        '@media (min-width: 0px)': {
          minWidth: 0,
        },
      },
    },
    // FORM - Inputs & labels
    MuiOutlinedInput: {
      root: {
        marginBottom: '2rem',
        marginTop: '1rem',
        '&:hover fieldset': {
          borderColor: '#54bbab !important',
        },
      },
      notchedOutline: {
        borderColor: '#e1e2e7',
      },
      inputMultiline: {
        lineHeight: '1.7 !important',
      },
    },
    MuiInputLabel: {
      root: {
        marginTop: '1rem',
        fontSize: '1.6rem',
        color: '#0c1424',
        letterSpacing: '0.1rem',
        fontWeight: 300,
      },
    },
    MuiInputBase: {
      input: {
        fontSize: '1.6rem',
        color: '#0c1424',
      },
    },
    // FORM - Switch
    MuiIconButton: {
      root: {
        '&:hover': {
          backgroundColor: 'rgba(84, 187, 171, 0.1)',
        },
      },
    },
    // FORM - Dropdown
    MuiSelect: {
      icon: {
        color: '#d8d8d8',
      },
      select: {
        '&:focus': {
          backgroundColor: 'white',
        },
      },
    },
    // FORM - Slider
    MuiSlider: {
      rail: {
        height: '0.5rem',
      },
      track: {
        height: '0.5rem',
      },
      thumb: {
        height: '1.8rem',
        width: '1.8rem',
        marginTop: '-0.2rem',
        marginLeft: '-0.9rem',
      },
      valueLabel: {
        left: 'auto',
        fontWeight: 500,
        circle: {
          width: '40px',
        },
      },
      MuiTooltip: {
        toolip: {
          backgroundColor: 'red !important',
        },
      },
    },

    // FORM - Checkbox
    MuiSvgIcon: {
      root: {
        width: '2rem',
        height: '2rem',
      },
    },

    // PROGRESS BAR
    MuiLinearProgress: {
      root: {
        height: '.6rem',
      },
    },

    // APPBAR
    MuiAppBar: {
      root: {
        zIndex: 10,
      },
    },

    MuiFormHelperText: {
      root: {
        marginTop: '-1.7rem',
        marginLeft: 0,
      },
    },
  },
});

export default theme;
