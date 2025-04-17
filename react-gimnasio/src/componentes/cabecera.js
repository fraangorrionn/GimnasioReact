import React from 'react';
import { Link } from 'react-router-dom';
import './cabecera.css';
import perfilIcono from '../assets/perfil.png'; // Asegúrate de tener una imagen en src/assets/
import logo from '../assets/logo.png';

export default function Cabecera() {
  return (
    <header className="cabecera">
      <div className="cabecera-superior">
        <div className="logo-titulo">
          <img src={logo} alt="Logo" className="logo" />
          <h1>Gimnasio Online</h1>
        </div>
        <div className="perfil-dropdown">
          <button className="perfil-btn">
            <img src={perfilIcono} alt="Perfil" className="perfil-icono" />
            <span>Mi cuenta ▾</span>
          </button>
          <div className="perfil-menu">
            <p>Nombre de usuario</p>
            <p>Rol: Cliente</p>
            <button>Cerrar sesión</button>
          </div>
        </div>
      </div>
      <div className="cabecera-nav">
        <nav>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/clases">Clases</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
