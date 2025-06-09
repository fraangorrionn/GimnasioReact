
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './registroPagina.css';

const API_URL = process.env.REACT_APP_API_URL;

function RegistroPagina() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    rol: 'cliente',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const evaluarFuerza = (password) => {
    let fuerza = 0;
    if (password.length >= 8) fuerza++;
    if (/[A-Z]/.test(password)) fuerza++;
    if (/[a-z]/.test(password)) fuerza++;
    if (/[0-9]/.test(password)) fuerza++;
    if (/[^A-Za-z0-9]/.test(password)) fuerza++;
    return fuerza;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const fuerza = evaluarFuerza(formData.password);

    if (formData.password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (fuerza <= 2) {
      setError("La contraseña es demasiado débil. Aumenta su seguridad.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/usuarios/registrar_usuario/`, formData);
      console.log('Usuario registrado:', response.data);
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data) {
        const errores = err.response.data;
        if (errores.username) {
          setError(errores.username[0]);
        } else if (errores.email) {
          setError(errores.email[0]);
        } else {
          setError("Error al registrarse. Verifica los datos.");
        }
      } else {
        setError("Error de conexión.");
      }
    }
  };

  const fuerza = evaluarFuerza(formData.password);
  const color =
    fuerza <= 2 ? 'red' : fuerza === 3 ? 'orange' : 'limegreen';

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2>Registro</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            value={formData.username}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          <input
            type="text"
            name="first_name"
            placeholder="Nombre"
            value={formData.first_name}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Apellidos"
            value={formData.last_name}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
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
          <div className="barra-fuerza-container">
            <div
              className="barra-fuerza"
              style={{
                width: `${(fuerza / 5) * 100}%`,
                backgroundColor: color,
              }}
            ></div>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
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