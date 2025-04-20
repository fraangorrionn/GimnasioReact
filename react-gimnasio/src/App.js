import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPagina from './paginas/loginPagina';
import RegistroPagina from './paginas/registroPagina';
import InicioPagina from './paginas/InicioPagina'; // Asegúrate de que este nombre de archivo sea correcto
import Cabecera from './componentes/cabecera';
import Footer from './componentes/footer';

function App() {
  return (
    <Router>
      <Cabecera />
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" />} />
        <Route path="/inicio" element={<InicioPagina />} />
        <Route path="/login" element={<LoginPagina />} />
        <Route path="/registro" element={<RegistroPagina />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
