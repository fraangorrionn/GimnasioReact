import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPagina from './paginas/loginPagina';
import RegistroPagina from './paginas/registroPagina';
import Cabecera from './componentes/cabecera';

function App() {
  return (
    <Router>
      <Cabecera />
      <div style={{ marginTop: '110px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPagina />} />
          <Route path="/registro" element={<RegistroPagina />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
