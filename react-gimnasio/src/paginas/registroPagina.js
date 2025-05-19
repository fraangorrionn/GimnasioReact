// src/paginas/registroPagina.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './registroPagina.css';

const API_URL = process.env.REACT_APP_API_URL;

function RegistroPagina() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    rol: 'cliente',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/usuarios/registrar_usuario/`, formData);
      console.log('Usuario registrado:', response.data);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Error al registrarse. Verifica los datos.');
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2>Registro</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Nombre de usuario" value={formData.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
          <select name="rol" value={formData.rol} onChange={handleChange}>
            <option value="cliente">Cliente</option>
            <option value="monitor">Monitor</option>
          </select>
          <button type="submit" className="btn-registrarse">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default RegistroPagina;
