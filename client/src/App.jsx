import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider, useIsAuthenticated, useMsal } from '@azure/msal-react';
import { msalInstance } from './auth/authConfig';
import Inicio from './pages/Inicio';
import Formulario from './pages/Formulario';
import Confirmacao from './pages/Confirmacao';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import './App.css';

// Componente para rotas protegidas
function PrivateRoute({ children }) {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? children : <Navigate to="/" />;
}

// Componente do cabeçalho com botões de login/logout
function Header() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  const handleLogin = () => {
    instance.loginRedirect();
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sistema de Matrícula PUCPR
        </Typography>
        {isAuthenticated ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" onClick={handleLogin}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Componente principal das rotas
function AppRoutes() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/formulario" element={<PrivateRoute><Formulario /></PrivateRoute>} />
            <Route path="/confirmacao" element={<PrivateRoute><Confirmacao /></PrivateRoute>} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

// Componente principal da aplicação
export default function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AppRoutes />
    </MsalProvider>
  );
}
