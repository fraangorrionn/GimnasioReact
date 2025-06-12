import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './cabecera.css';
import perfilIcono from '../assets/perfil.png';
import logo from '../assets/logo.png';
import iconoInicio from '../assets/home.png';
import iconoCategorias from '../assets/categorias.png';
import iconoCrear from '../assets/crear.png';
import iconoCategoriasCrud from '../assets/crear_categorias.png';
import Notificacion from './Notificacion';
import PanelCategorias from './PanelCategorias';
import './PanelCategorias.css';

export default function Cabecera() {
  const [suscripcionActiva, setSuscripcionActiva] = useState(false);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'success' });
  const [categorias, setCategorias] = useState([]);
  const [mostrarPanelCategorias, setMostrarPanelCategorias] = useState(false);
  const navigate = useNavigate();

  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setNotificacion({ visible: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ ...notificacion, visible: false }), 3000);
  };

  useEffect(() => {
    const usuarioData = JSON.parse(localStorage.getItem('usuario'));
    const tokenData = localStorage.getItem('access_token');

    if (usuarioData?.rol === 'cliente' && tokenData) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/suscripciones/`, {
        headers: { Authorization: `Bearer ${tokenData}` }
      }).then(res => {
        const activa = res.data.some(s => s.estado === 'activa');
        setSuscripcionActiva(activa);
      }).catch(console.error);
    }

    if (usuarioData?.foto_perfil_url) {
      setFotoPerfilUrl(usuarioData.foto_perfil_url);
    }

    axios.get(`${process.env.REACT_APP_API_URL}/api/categorias_clase/`)
      .then(res => setCategorias(res.data))
      .catch(console.error);
  }, []);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  const manejarArchivo = (e) => {
    setArchivoSeleccionado(e.target.files[0]);
  };

  const subirFoto = () => {
    const token = localStorage.getItem('access_token');
    if (!archivoSeleccionado) {
      mostrarNotificacion('Selecciona una imagen primero', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('foto_perfil', archivoSeleccionado);

    axios.patch(`${process.env.REACT_APP_API_URL}/api/usuario/foto_perfil/`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      setFotoPerfilUrl(res.data.foto_perfil_url);
      localStorage.setItem('usuario', JSON.stringify(res.data));
      setMostrarModal(false);
      mostrarNotificacion('Foto actualizada con éxito', 'success');
    }).catch(err => {
      console.error(err);
      mostrarNotificacion('Error al subir la imagen', 'error');
    });
  };

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const esMonitor = usuario?.rol === 'monitor' || usuario?.rol === 'admin';

  return (
    <header className="cabecera">
      <Notificacion
        mensaje={notificacion.mensaje}
        tipo={notificacion.tipo}
        visible={notificacion.visible}
        onClose={() => setNotificacion({ ...notificacion, visible: false })}
      />

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
            <li>
              <Link to="/inicio">
                <img src={iconoInicio} alt="Inicio" className="icono-nav" />
                Inicio
              </Link>
            </li>
            <li onClick={() => setMostrarPanelCategorias(true)} style={{ cursor: 'pointer' }}>
              <img src={iconoCategorias} alt="Categorías" className="icono-nav" />
              <span className="enlace-nav">Categorías</span>
            </li>
            {esMonitor && (
              <>
                <li>
                  <Link to="/crud/clases">
                    <img src={iconoCrear} alt="Crear" className="icono-nav" />
                    Crear Clases
                  </Link>
                </li>
                <li>
                  <Link to="/crud/categorias">
                    <img src={iconoCategoriasCrud} alt="Categorías" className="icono-nav" />
                    Gestionar Categorías
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <PanelCategorias
        visible={mostrarPanelCategorias}
        onClose={() => setMostrarPanelCategorias(false)}
        categorias={categorias}
      />

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