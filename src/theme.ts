import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#000000',          // colorBack
            paper: '#1a1a1a',            // colorBackLighter
        },
        primary: {
            light: '#2E2E2E',            // colorPrimaryLighter
            main: '#232323',             // colorPrimary
            dark: '#171717',             // colorPrimaryDark
            contrastText: '#e6e6e6',     // colorLessLight
        },
        secondary: {
            main: '#FF0000',             // colorAccent
            dark: '#AF0000',             // colorAccentDarker
            light: '#ff3d3d',            // colorAccentLighter
        },
        error: {
            main: '#FF0000',             // colorError
        },
        success: {
            main: '#00941e',             // colorSuccess
        },
        warning: {
            main: '#ffe100',             // colorAlert
        },
        info: {
            main: '#00a2ff',             // colorNiceBlue
        },
        text: {
            primary: '#FFFFFF',          // colorLight
            secondary: '#909090',        // colorGray
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        button: {
            textTransform: 'none',
        },
    },
    
    components: {
        MuiBottomNavigation: {
            styleOverrides: {
                root: {
                    backgroundColor: '#2E2E2E', // container bakgrunn
                },
            },
        },
        MuiBottomNavigationAction: {
            styleOverrides: {
                root: {
                    color: '#909090', // inaktive ikoner
                    '&.Mui-selected': {
                        color: '#FF0000', // aktiv ikon og tekst
                    },
                },
            },
        },
    }
});

export default responsiveFontSizes(theme);
