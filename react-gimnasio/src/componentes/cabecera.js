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
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  useEffect(() => {
    if (usuario?.rol === 'cliente' && token) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/suscripciones/`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        const activa = res.data.some(s => s.estado === 'activa');
        setSuscripcionActiva(activa);
      }).catch(console.error);
    }
    if (usuario?.foto_perfil_url) {
      setFotoPerfilUrl(usuario.foto_perfil_url);
    }
  }, [usuario, token]);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Subir foto
  const manejarArchivo = (e) => {
    setArchivoSeleccionado(e.target.files[0]);
  };

  const subirFoto = () => {
    if (!archivoSeleccionado) return alert('Selecciona una imagen primero');
    const formData = new FormData();
    formData.append('foto_perfil', archivoSeleccionado);

    axios.patch(`${process.env.REACT_APP_API_URL}/api/usuario/foto_perfil/`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      setFotoPerfilUrl(res.data.foto_perfil_url);
      // Actualizar usuario localStorage para reflejar cambio
      localStorage.setItem('usuario', JSON.stringify(res.data));
      setMostrarModal(false);
    }).catch(err => {
      console.error(err);
      alert('Error al subir la imagen');
    });
  };

  const esMonitor = usuario?.rol === 'monitor' || usuario?.rol === 'admin';

  return (
    <header className="cabecera">
      <div className="cabecera-superior">
        <div className="logo-titulo">
          <img src={logo} alt="Logo" className="logo" />
          <h1>Gimnasio Online</h1>
        </div>
        <div className="perfil-dropdown">
          <button className="perfil-btn" onClick={() => setMostrarModal(!mostrarModal)}>
            <img
              src={fotoPerfilUrl || perfilIcono}
              alt="Perfil"
              className="perfil-icono"
              style={{ borderRadius: '50%', width: '40px', height: '40px', objectFit: 'cover' }}
            />
            <span>{usuario?.username || 'Mi cuenta'} ▾</span>
          </button>
          <div className="perfil-menu">
            <p><strong>{usuario?.username || 'Usuario'}</strong></p>
            <p>Rol: {usuario?.rol || 'Cliente'}</p>

            {/* Botón para abrir modal de editar foto */}
            <button onClick={() => setMostrarModal(true)}>Editar foto de perfil</button>

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
          <li className="categorias-dropdown">
            <span>Categorías ▾</span>
            <ul className="submenu-categorias">
              <li><Link to="/categorias/mma">MMA</Link></li>
              <li><Link to="/categorias/boxeo">Boxeo</Link></li>
              <li><Link to="/categorias/taekwondo">Taekwondo</Link></li>
              <li><Link to="/categorias/muai-thai">Muai Thai</Link></li>
              <li><Link to="/categorias/zumba">Zumba</Link></li>
              <li><Link to="/categorias/natacion">Natación</Link></li>
              <li><Link to="/categorias/yoga">Yoga</Link></li>
              <Link to="/categorias/entrenamiento-de-fuerza">Entrenamiento de fuerza</Link>
            </ul>
          </li>
          {esMonitor && <li><Link to="/crud/clases">Crear Clases</Link></li>}
        </ul>
        </nav>
      </div>

      {/* Modal para subir foto */}
      {mostrarModal && (
        <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Subir nueva foto de perfil</h2>
            <input type="file" accept="image/*" onChange={manejarArchivo} />
            <button onClick={subirFoto}>Subir</button>
            <button onClick={() => setMostrarModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </header>
  );
}
