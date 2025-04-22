import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CrudFormulario.css';

function SuscripcionView() {
  const [formulario, setFormulario] = useState({ estado: 'activa' });
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const navigate = useNavigate();

  const crearSuscripcion = () => {
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };
    const datos = { ...formulario, usuario: usuario.id };

    axios.post('http://localhost:8000/api/suscripciones/crear/', datos, { headers })
      .then(() => {
        alert('Suscripción creada con éxito.');
        navigate('/pago');
      })
      .catch(err => {
        alert('Error al crear la suscripción');
        console.error(err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  return (
    <div className="crud-clases-container">
      <div className="formulario-clase">
        <h2>Suscribirse al Gimnasio</h2>
        <form onSubmit={e => e.preventDefault()}>
          <label>Estado</label>
          <select name="estado" value={formulario.estado} onChange={handleChange}>
            <option value="activa">Activa</option>
          </select>

          <div className="botones-formulario">
            <button onClick={crearSuscripcion} className="btn-crear">Confirmar suscripción</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SuscripcionView;

