// src/components/Header.tsx
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';

export interface HeaderProps {
  title?: string;
  onBackClicked?: () => void;
}

export default function Header({ title, onBackClicked }: HeaderProps) {
  return (
    <AppBar position="fixed" color="info" elevation={0} sx={{ top: "36px"}}>
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
              textAlign: 'center',
              fontWeight: 'bold',
              fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
              color: 'white',
            }}
          >
            {title}
          </Typography>
        )}

        <div style={{ width: 48 }} /> {/* tom plass for høyre side */}
      </Toolbar>
    </AppBar>
  );
}
