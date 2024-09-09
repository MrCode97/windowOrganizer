import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#122413;', // Customize your primary color
    },
    secondary: {
      main: '#2D2923', // Customize your secondary color
    },
    background: {
      background: { default: '#FFF4E0' }, // Background color
    },
    text: {
      primary: '#333', // Default text color
      secondary: '#666', // Secondary text color
    },
  },
  typography: {
    h2: {
      fontSize: '2.5rem', // Customize title font size
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '8px 0',
      color: '#ffe1ba;',
      backgroundColor: '#515151'
    },
    body1: {
      fontSize: '1rem', // Default paragraph font size
      lineHeight: 1.6,
      textAlign: 'left',
      padding: '8px 16px',
      //backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
      borderRadius: '4px', // Rounded corners
      color: '#ffe1ba;',
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
          backgroundColor: 'rgb(173, 216, 230)', // Light blue background for dialogs
          borderRadius: '8px',
          padding: '16px',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(173, 216, 230)', // Matching the dialog header background
        },
        indicator: {
          backgroundColor: '#3f51b5', // Primary color for the tab indicator
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#333', // Tab text color
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: '#fff', // White text for primary buttons
          backgroundColor: '#2C5F2D', // Primary button background color
          '&:hover': {
            backgroundColor: '#303f9f', // Darker shade on hover
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
          //backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background for text
          padding: '4px 8px',
          borderRadius: '4px',
        },
      },
    },
    MuiGrid2: {
      styleOverrides: {
        root: {
          spacing: 2, // Default grid spacing
          justifyContent: 'center',
        },
      },
    },
    // Custom styles for lists
    MuiList: {
      styleOverrides: {
        root: {
          //backgroundColor: '#FFF4E0', // Default list background color
          padding: '8px', // Padding around the list
          borderRadius: '8px', // Rounded corners for the list
          marginTop: '20px', // Top margin
          marginBottom: '20px', // Bottom margin
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '8px 16px', // Padding inside list items
          '&:hover': {
            backgroundColor: '#F5CBA7', // Background color on hover
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '5px', // Rounded corners for list item button
          '&:hover': {
            backgroundColor: '#F5CBA7', // Hover background color for list item button
          },
        },
      },
    },
  },
});

export default theme;
