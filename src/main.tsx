import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './features/app/store.ts'
import React from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme.ts'
import './features/app/FirebaseMessageService.ts';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
)
