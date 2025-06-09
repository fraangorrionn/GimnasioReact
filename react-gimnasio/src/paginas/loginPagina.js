
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './loginPagina.css';

const API_URL = process.env.REACT_APP_API_URL;

function LoginPagina() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
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

      const decoded = jwtDecode(access);
      const usuario = {
        id: decoded.user_id,
        username: decoded.username,
        rol: decoded.rol
      };

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
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            name="username"
            placeholder="Correo electrónico o nombre de usuario"
            value={formData.username}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#ccc',
                cursor: 'pointer'
              }}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          <button type="submit" className="btn-entrar">Entrar</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="registro-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPagina;