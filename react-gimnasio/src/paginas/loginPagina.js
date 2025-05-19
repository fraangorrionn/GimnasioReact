import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './loginPagina.css';

const API_URL = process.env.REACT_APP_API_URL;

function LoginPagina() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/login/`, formData);
      const { access, refresh } = response.data;

      // Decodificar token para obtener username y rol
      const decoded = jwtDecode(access);
      const usuario = {
        id: decoded.user_id,
        username: decoded.username,
        rol: decoded.rol
      };

      // Guardar en localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      navigate('/clases');
    } catch (err) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Usuario o correo" value={formData.username} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="btn-entrar">Entrar</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="registro-link">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
      </div>
    </div>
  );
}

export default LoginPagina;
