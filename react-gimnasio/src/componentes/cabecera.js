import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './cabecera.css';
import perfilIcono from '../assets/perfil.png';
import logo from '../assets/logo.png';

export default function Cabecera() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const token = localStorage.getItem('access_token');

  const [suscripcionActiva, setSuscripcionActiva] = useState(false);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  useEffect(() => {
    if (usuario?.rol === 'cliente' && token) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/suscripciones/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
        const activa = res.data.some(s => s.estado === 'activa');
        setSuscripcionActiva(activa);
        localStorage.removeItem('suscripcion_activada');
      }).catch(err => {
        console.error('Error al obtener suscripciones:', err);
      });
    }
  }, [usuario, token, localStorage.getItem('suscripcion_activada')]);
  

  const esMonitor = usuario?.rol === 'monitor' || usuario?.rol === 'admin';

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
            <span>{usuario?.username || 'Mi cuenta'} ▾</span>
          </button>
          <div className="perfil-menu">
            <p><strong>{usuario?.username || 'Usuario'}</strong></p>
            <p>Rol: {usuario?.rol || 'Cliente'}</p>

            {usuario?.rol === 'cliente' && (
              <div>
                {suscripcionActiva ? (
                  <p style={{ color: 'limegreen' }}>Suscripción activa</p>
                ) : (
                  <button onClick={() => navigate('/pago')}>
                    Suscribirse
                  </button>
                )}
              </div>
            )}

            <button onClick={cerrarSesion}>Cerrar sesión</button>
          </div>
        </div>
      </div>

      <div className="cabecera-nav">
        <nav>
          <ul>
            <li><Link to="/inicio">Inicio</Link></li>
            {esMonitor && <li><Link to="/crud/clases">Crear Clases</Link></li>}
          </ul>
        </nav>
      </div>
    </header>
  );
}
