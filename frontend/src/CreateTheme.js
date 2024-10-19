import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#122413',
    },
    secondary: {
      main: '#2D2923',
    },
    background: {
      default: '#FFF4E0',
    },
    text: {
      primary: 'rgb(255, 225, 186)',
      secondary: '#666',
    },
  },
  typography: {
    h2: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '8px 0',
      color: '#ffe1ba',
    },
    h4: {
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '8px 0',
      color: '#ffe1ba',
    },
    h6: {
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '8px 0',
      color: '#ffe1ba',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      textAlign: 'left',
      padding: '8px 16px',
      borderRadius: '4px',
      color: '#ffe1ba',
    },
  },
  components: {
    MuiBox: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2D2923',
          borderRadius: '8px',
          padding: '16px',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: '#122413',
          borderRadius: '8px',
        },
        indicator: {
          backgroundColor: 'rgb(255, 165, 0)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#ffe1ba',
          '&.Mui-selected': {
            color: '#ffe1ba',
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: '#fff',
          backgroundColor: '#2C5F2D',
          '&:hover': {
            backgroundColor: '#303f9f',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: 'normal',
          '& .MuiInputBase-root': {
            borderRadius: '4px',
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginBottom: '8px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          padding: '4px 8px',
          borderRadius: '4px',
        },
      },
    },
    MuiGrid2: {
      styleOverrides: {
        root: {
          spacing: 2,
          justifyContent: 'center',
        },
      },
    },
    // Custom styles for lists
    MuiList: {
      styleOverrides: {
        root: {
          padding: '8px',
          borderRadius: '8px',
          marginTop: '20px',
          marginBottom: '20px',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
          '&:hover': {
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '5px',
          '&:hover': {
            backgroundColor: '#122413',
          },
        },
      },
    },
  },
});

export default theme;
