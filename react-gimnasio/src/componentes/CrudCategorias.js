
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CrudFormulario.css';
import Notificacion from './Notificacion';

const API_URL = process.env.REACT_APP_API_URL;

function CrudCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [formulario, setFormulario] = useState({ nombre: '' });
  const [imagenCategoria, setImagenCategoria] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'success' });

  const token = localStorage.getItem('access_token');

  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setNotificacion({ visible: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ ...notificacion, visible: false }), 3000);
  };

  const obtenerCategorias = () => {
    axios.get(`${API_URL}/api/categorias_clase/`)
      .then(res => setCategorias(res.data))
      .catch(() => mostrarNotificacion('Error al cargar categorías', 'error'));
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const limpiarFormulario = () => {
    setFormulario({ nombre: '' });
    setImagenCategoria(null);
    setCategoriaSeleccionada(null);
    setModoEdicion(false);
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const crearCategoria = () => {
    const formData = new FormData();
    formData.append('nombre', formulario.nombre);
    if (imagenCategoria) formData.append('imagen', imagenCategoria);

    axios.post(`${API_URL}/api/categorias/crear/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => {
      obtenerCategorias();
      mostrarNotificacion('Categoría creada', 'success');
      limpiarFormulario();
    })
    .catch(() => mostrarNotificacion('Error al crear la categoría', 'error'));
  };

  const editarCategoria = () => {
    const formData = new FormData();
    formData.append('nombre', formulario.nombre);
    if (imagenCategoria) formData.append('imagen', imagenCategoria);

    axios.put(`${API_URL}/api/categorias/editar/${categoriaSeleccionada}/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => {
      obtenerCategorias();
      mostrarNotificacion('Categoría editada', 'success');
      limpiarFormulario();
    })
    .catch(() => mostrarNotificacion('Error al editar la categoría', 'error'));
  };

  const eliminarCategoria = (id) => {
    axios.delete(`${API_URL}/api/categorias/eliminar/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      obtenerCategorias();
      mostrarNotificacion('Categoría eliminada', 'success');
    })
    .catch(() => mostrarNotificacion('Error al eliminar la categoría', 'error'));
  };

  const seleccionarCategoria = (categoria) => {
    setModoEdicion(true);
    setCategoriaSeleccionada(categoria.id);
    setFormulario({ nombre: categoria.nombre });
    setImagenCategoria(null);
  };

  return (
    <div className="crud-clases-container">
      <Notificacion 
        mensaje={notificacion.mensaje}
        tipo={notificacion.tipo}
        visible={notificacion.visible}
        onClose={() => setNotificacion({ ...notificacion, visible: false })}
      />

      <div className="formulario-clase">
        <h2>{modoEdicion ? 'Editar Categoría' : 'Crear Categoría'}</h2>
        <form onSubmit={e => e.preventDefault()}>
          <label>Nombre</label>
          <input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Nombre de la categoría" />

          <label>Imagen de la categoría</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImagenCategoria(e.target.files[0])}
          />

          <div className="botones-formulario">
            {modoEdicion ? (
              <>
                <button onClick={editarCategoria} className="btn-editar">Guardar cambios</button>
                <button onClick={limpiarFormulario} className="btn-cancelar">Cancelar</button>
              </>
            ) : (
              <button onClick={crearCategoria} className="btn-crear">Crear categoría</button>
            )}
          </div>
        </form>
      </div>

      <div className="lista-clases">
        {categorias.map(categoria => (
          <div key={categoria.id} className="tarjeta-clase">
            {categoria.imagen_url && (
              <img
                src={categoria.imagen_url}
                alt={`Imagen de ${categoria.nombre}`}
              />
            )}
            <h3>{categoria.nombre}</h3>
            <div className="acciones">
              <button onClick={() => seleccionarCategoria(categoria)} className="btn-editar">Editar</button>
              <button onClick={() => eliminarCategoria(categoria.id)} className="btn-cancelar">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CrudCategorias;