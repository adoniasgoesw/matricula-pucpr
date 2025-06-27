import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './auth/authConfig';
import Inicio from './pages/Inicio';
import Formulario from './pages/Formulario';
import Confirmacao from './pages/Confirmacao';
import './App.css';

// Componente principal das rotas
function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
      </Routes>
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
