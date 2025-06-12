
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './CrudFormulario.css';
import { obtenerClases, obtenerCategorias } from '../services/claseService';
import Notificacion from './Notificacion';

const API_URL = process.env.REACT_APP_API_URL;

function CrudClases() {
  const [clases, setClases] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    cupo_maximo: 10,
    usuario: 1
  });
  const [imagenClase, setImagenClase] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'success' });

  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const token = localStorage.getItem('access_token');
  const esMonitor = token ? jwtDecode(token).rol === 'monitor' || jwtDecode(token).rol === 'admin' : false;

  useEffect(() => {
    if (esMonitor) {
      obtenerClases().then(setClases);
      obtenerCategorias().then(setCategorias);
      setFormulario(prev => ({ ...prev, usuario: usuario.id }));
    }
  }, [esMonitor, usuario.id]);

  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setNotificacion({ visible: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ ...notificacion, visible: false }), 3000);
  };

  const limpiarFormulario = () => {
    setFormulario({
      nombre: '',
      descripcion: '',
      categoria: '',
      cupo_maximo: 10,
      usuario: usuario.id
    });
    setClaseSeleccionada(null);
    setModoEdicion(false);
    setImagenClase(null);
  };

  const handleChange = e => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };
  const crearClase = () => {
    if (!esMonitor) return;
  
    if (!imagenClase) {
      mostrarNotificacion("Debes seleccionar una imagen para la clase", "error");
      return;
    }
  
    console.log("Imagen seleccionada:", imagenClase);
  
    const formData = new FormData();
    formData.append('nombre', formulario.nombre);
    formData.append('descripcion', formulario.descripcion);
    formData.append('categoria', formulario.categoria);
    formData.append('cupo_maximo', formulario.cupo_maximo);
    formData.append('usuario', formulario.usuario);
    formData.append('imagen', imagenClase);
    if (imagenClase) formData.append('imagen', imagenClase);

    axios.post(`${API_URL}/api/clases/crear/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => {
      obtenerClases().then(setClases);
      mostrarNotificacion('Clase creada', 'success');
      limpiarFormulario();
    })
    .catch(err => {
      console.error(err);
      mostrarNotificacion('Error al crear la clase', 'error');
    });
  };

  const editarClase = () => {
    const formData = new FormData();
    formData.append('nombre', formulario.nombre);
    formData.append('descripcion', formulario.descripcion);
    formData.append('categoria', formulario.categoria);
    formData.append('cupo_maximo', formulario.cupo_maximo);
    formData.append('usuario', formulario.usuario);
    if (imagenClase) formData.append('imagen', imagenClase);

    axios.put(`${API_URL}/api/clases/editar/${claseSeleccionada}/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => {
      obtenerClases().then(setClases);
      mostrarNotificacion('Clase editada', 'success');
      limpiarFormulario();
    })
    .catch(err => {
      console.error(err);
      mostrarNotificacion('Error al editar la clase', 'error');
    });
  };

  const eliminarClase = (id) => {
    axios.delete(`${API_URL}/api/clases/eliminar/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      obtenerClases().then(setClases);
      mostrarNotificacion('Clase eliminada', 'success');
    })
    .catch(err => {
      console.error(err);
      mostrarNotificacion('Error al eliminar la clase', 'error');
    });
  };

  const seleccionarClase = (clase) => {
    setModoEdicion(true);
    setClaseSeleccionada(clase.id);
    setFormulario({
      nombre: clase.nombre,
      descripcion: clase.descripcion,
      categoria: clase.categoria,
      cupo_maximo: clase.cupo_maximo,
      usuario: clase.usuario
    });
    setImagenClase(null);
  };

  if (!esMonitor) return <div>No tienes permiso para ver esta página.</div>;

  return (
    <div className="crud-clases-container">
      <Notificacion 
        mensaje={notificacion.mensaje}
        tipo={notificacion.tipo}
        visible={notificacion.visible}
        onClose={() => setNotificacion({ ...notificacion, visible: false })}
      />

      <div className="formulario-clase">
        <h2>{modoEdicion ? 'Editar Clase' : 'Crear Clase'}</h2>
        <form onSubmit={e => e.preventDefault()}>
          <label>Nombre</label>
          <input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Nombre de la clase" />

          <label>Descripción</label>
          <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange} placeholder="Descripción de la clase"></textarea>

          <label>Categoría</label>
          <select
            name="categoria"
            value={formulario.categoria}
            onChange={handleChange}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>

          <label>Cupo máximo</label>
          <input type="number" name="cupo_maximo" value={formulario.cupo_maximo} onChange={handleChange} />

          <label>Imagen de la clase</label>
          <input
            key={modoEdicion ? claseSeleccionada : Date.now()}
            type="file"
            accept="image/*"
            onChange={(e) => setImagenClase(e.target.files[0])}
          />

          <div className="botones-formulario">
            {modoEdicion ? (
              <>
                <button onClick={editarClase} className="btn-editar">Guardar cambios</button>
                <button onClick={limpiarFormulario} className="btn-cancelar">Cancelar</button>
              </>
            ) : (
              <button onClick={crearClase} className="btn-crear">Crear clase</button>
            )}
          </div>
        </form>
      </div>

      <div className="lista-clases">
        {clases.map(clase => (
          <div key={clase.id} className="tarjeta-clase">
            {clase.imagen_url && (
              <img
                src={clase.imagen_url}
                alt={`Imagen de ${clase.nombre}`}
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
              />
            )}
            <h3>{clase.nombre}</h3>
            <p><strong>Descripción:</strong> {clase.descripcion}</p>
            <p><strong>Categoría:</strong> {clase.categoria_nombre}</p>
            <p><strong>Cupo máximo:</strong> {clase.cupo_maximo}</p>
            <div className="acciones">
              <button onClick={() => seleccionarClase(clase)} className="btn-editar">Editar</button>
              <button onClick={() => eliminarClase(clase.id)} className="btn-cancelar">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CrudClases;