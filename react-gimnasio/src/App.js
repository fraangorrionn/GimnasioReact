import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPagina from './paginas/loginPagina';
import RegistroPagina from './paginas/registroPagina';
import InicioPagina from './paginas/InicioPagina';
import Cabecera from './componentes/cabecera';
import Footer from './componentes/footer';
import CrudClases from './componentes/CrudClases';
import ClaseDetalle from './componentes/ClaseDetalle';
import PagoView from './componentes/PagoView';
import CategoriaDetalle from './componentes/CategoriaDetalle';
import CrudCategorias from './componentes/CrudCategorias';
import PanelCategorias from './componentes/PanelCategorias';
import './App.css';

function App() {
  const [mostrarPanelCategorias, setMostrarPanelCategorias] = useState(false);
  const [categorias, setCategorias] = useState([]);

  return (
    <Router>
      <Cabecera
        mostrarPanelCategorias={mostrarPanelCategorias}
        setMostrarPanelCategorias={setMostrarPanelCategorias}
        setCategorias={setCategorias}
        categorias={categorias}
      />
      {mostrarPanelCategorias && (
        <PanelCategorias
          visible={mostrarPanelCategorias}
          onClose={() => setMostrarPanelCategorias(false)}
          categorias={categorias}
        />
      )}
      <div className="contenido-app">
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="/inicio" element={<InicioPagina />} />
          <Route path="/login" element={<LoginPagina />} />
          <Route path="/registro" element={<RegistroPagina />} />
          <Route path="/crud/clases" element={<CrudClases />} />
          <Route path="/clases/:id" element={<ClaseDetalle />} />
          <Route path="/pago" element={<PagoView />} />
          <Route path="/categorias/:categoriaNombre" element={<CategoriaDetalle />} />
          <Route path="/crud/categorias" element={<CrudCategorias />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;