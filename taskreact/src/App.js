import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './components/DashBoard'; 
import Profile from './components/Profile';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthForm />} />  {/* Ruta para el formulario de autenticación */}
      <Route path="dashboard" element={<Dashboard />} />  {/* Ruta para el dashboard */} 
      <Route path="profile" element={<Profile />} />  {/* Ruta para el perfil */} 
    </Routes>
  );
};

export default App; // Exportar el componente App

