import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CrudFormulario.css';

function PagoView() {
  const [formulario, setFormulario] = useState({
    suscripcion: '',
    cantidad: 20,
    estado: 'completado',
    tipo: 'mensual'
  });

  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    axios.get('http://localhost:8000/api/suscripciones/', { headers })
      .then(res => {
        const activas = res.data
          .filter(s => s.usuario === usuario.id && s.estado === 'activa')
          .sort((a, b) => new Date(b.fecha_suscripcion) - new Date(a.fecha_suscripcion));

        if (activas.length > 0) {
          setFormulario(prev => ({ ...prev, suscripcion: activas[0].id }));
        } else {
          alert('No se encontró una suscripción activa. Redirigiendo...');
          navigate('/suscripcion');
        }
      })
      .catch(err => {
        console.error('Error al obtener suscripciones:', err);
        alert('Error al obtener la suscripción');
      });
  }, [usuario.id, token, navigate]);

  const realizarPago = () => {
    const headers = { Authorization: `Bearer ${token}` };

    if (!formulario.suscripcion) {
      alert('No hay suscripción válida asociada');
      return;
    }

    const datos = {
      suscripcion: formulario.suscripcion,
      cantidad: formulario.cantidad,
      estado: 'completado'
    };

    axios.post('http://localhost:8000/api/pagos/crear/', datos, { headers })
      .then(() => {
        alert('Pago realizado con éxito');
        navigate('/inicio');
      })
      .catch(err => {
        alert('Error al registrar el pago');
        console.error(err);
      });
  };

  const handleTipoChange = (e) => {
    const tipo = e.target.value;
    const cantidad = tipo === 'anual' ? 200 : 20;
    setFormulario({ ...formulario, tipo, cantidad });
  };

  return (
    <div className="crud-clases-container">
      <div className="formulario-clase">
        <h2>Realizar pago</h2>
        <form onSubmit={e => e.preventDefault()}>
          <label>Tipo de suscripción</label>
          <select name="tipo" value={formulario.tipo} onChange={handleTipoChange}>
            <option value="mensual">Mensual - 20€</option>
            <option value="anual">Anual - 200€</option>
          </select>

          <label>Cantidad (€)</label>
          <input
            type="number"
            name="cantidad"
            value={formulario.cantidad}
            disabled
            style={{ backgroundColor: '#eee', color: '#444' }}
          />

          {/* Estado fijo en completado */}
          <input type="hidden" name="estado" value="completado" />

          <div className="botones-formulario">
            <button onClick={realizarPago} className="btn-crear">Pagar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PagoView;
