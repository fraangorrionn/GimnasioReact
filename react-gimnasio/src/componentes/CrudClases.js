import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import './CrudFormulario.css';

const API_URL = process.env.REACT_APP_API_URL;

function CrudClases() {
  const [clases, setClases] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    tipo: '',
    cupo_maximo: 10,
    usuario: 1
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);

  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const token = localStorage.getItem('access_token');
  const esMonitor = token ? jwtDecode(token).rol === 'monitor' || jwtDecode(token).rol === 'admin' : false;

  useEffect(() => {
    if (esMonitor) {
      obtenerClases();
      setFormulario(prev => ({ ...prev, usuario: usuario.id }));
    }
  }, [esMonitor, usuario.id]);

  const obtenerClases = () => {
    axios.get(`${API_URL}/api/clases/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setClases(res.data))
      .catch(err => console.error(err));
  };

  const crearClase = () => {
    if (!esMonitor) {
      console.log("Permiso denegado. Solo los monitores pueden crear clases.");
      return;
    }

    axios.post(`${API_URL}/api/clases/crear/`, formulario, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        obtenerClases();
        alert('Clase creada');
        limpiarFormulario();
      })
      .catch(err => console.error(err));
  };

  const eliminarClase = (id) => {
    axios.delete(`${API_URL}/api/clases/eliminar/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => obtenerClases())
      .catch(err => console.error(err));
  };

  const editarClase = () => {
    axios.put(`${API_URL}/api/clases/editar/${claseSeleccionada}/`, formulario, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        obtenerClases();
        alert('Clase editada');
        setModoEdicion(false);
        limpiarFormulario();
      })
      .catch(err => console.error(err));
  };

  const seleccionarClase = (clase) => {
    setModoEdicion(true);
    setClaseSeleccionada(clase.id);
    setFormulario({
      nombre: clase.nombre,
      descripcion: clase.descripcion,
      tipo: clase.tipo,
      cupo_maximo: clase.cupo_maximo,
      usuario: clase.usuario
    });
  };

  const limpiarFormulario = () => {
    setFormulario({ nombre: '', descripcion: '', tipo: '', cupo_maximo: 10, usuario: usuario.id });
    setClaseSeleccionada(null);
    setModoEdicion(false);
  };

  const handleChange = e => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  if (!esMonitor) return <div>No tienes permiso para ver esta página.</div>;

  return (
    <div className="crud-clases-container">
      <div className="formulario-clase">
        <h2>{modoEdicion ? 'Editar Clase' : 'Crear Clase'}</h2>
        <form onSubmit={e => e.preventDefault()}>
          <label>Nombre</label>
          <input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Nombre de la clase" />

          <label>Descripción</label>
          <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange} placeholder="Descripción de la clase"></textarea>

          <label>Tipo</label>
          <input type="text" name="tipo" value={formulario.tipo} onChange={handleChange} placeholder="Tipo (ej: boxeo, yoga...)" />

          <label>Cupo máximo</label>
          <input type="number" name="cupo_maximo" value={formulario.cupo_maximo} onChange={handleChange} />

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
            <h3>{clase.nombre}</h3>
            <p><strong>Descripción:</strong> {clase.descripcion}</p>
            <p><strong>Tipo:</strong> {clase.tipo}</p>
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
