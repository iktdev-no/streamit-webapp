// src/components/Header.tsx
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { showServerBanner } from '../store/appSlice';

export interface HeaderProps {
  title?: string;
  backgroundColor?: string;
  onBackClicked?: () => void;
  rightElement?: React.ReactNode
}

export default function Header({ title, onBackClicked, backgroundColor, rightElement }: HeaderProps) {
  const isServerBannerVisible = useSelector(showServerBanner);

  return (
    <AppBar position="fixed" color="info" elevation={0} sx={{
      top: (isServerBannerVisible) ? "36px" : "0px",
      backgroundColor: (backgroundColor) ? backgroundColor : 'primary.main'
    }}>
      <Toolbar sx={{ minHeight: 64, display: 'flex', justifyContent: 'space-between' }}>
        {onBackClicked ? (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={onBackClicked}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
        ) : (
          <div style={{ width: 48 }} /> // tom plass for å balansere layout
        )}

        {title && (
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: 'left',
              fontWeight: 'bold',
              fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
              color: 'white',
            }}
          >
            {title}
          </Typography>
        )}

        {rightElement}
      </Toolbar>
    </AppBar>
  );
}
