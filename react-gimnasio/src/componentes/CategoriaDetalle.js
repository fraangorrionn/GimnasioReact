
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function CategoriaDetalle() {
  const { categoriaNombre } = useParams();
  const [clases, setClases] = useState([]);
  const [monitores, setMonitores] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    axios.get(`${API_URL}/api/categorias/${categoriaNombre}/clases/`)
      .then(res => {
        setCategoria(res.data.categoria);
        setClases(res.data.clases);
        setMonitores(res.data.monitores || []);
        setCargando(false);
      })
      .catch(err => {
        console.error(err);
        setCargando(false);
      });
  }, [categoriaNombre]);

  if (cargando) return <div>Cargando clases...</div>;

  return (
    <div className="categoria-detalle-container">
      <h2 style={{ color: '#4ade80', textAlign: 'center', marginBottom: '1rem' }}>
        Categoría: {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
      </h2>

      {/* Sección de Monitores */}
      {monitores.length > 0 && (
        <div className="monitores-categoria" style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#4ade80' }}>Monitores que imparten esta categoría:</h3>
          <div className="tarjetas-clases">
            {monitores.map(monitor => (
              <div key={monitor.id} className="tarjeta-clase">
                {monitor.foto_perfil_url && (
                  <img src={monitor.foto_perfil_url} alt={monitor.username}
                    style={{
                      width: '100%',
                      maxHeight: '150px',
                      objectFit: 'contain',
                      borderRadius: '6px',
                      marginBottom: '0.5rem',
                      backgroundColor: '#000',
                      padding: '4px'
                  }} />
                
                )}
                <h3>{monitor.first_name} {monitor.last_name}</h3>
                <p><strong>Correo:</strong> {monitor.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de Clases */}
      <h3 style={{ color: '#4ade80', marginTop: '2rem' }}>Clases disponibles:</h3>
      {clases.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No hay clases disponibles en esta categoría.</p>
      ) : (
        <div className="tarjetas-clases">
          {clases.map(clase => (
            <div key={clase.id} className="tarjeta-clase">
              {clase.imagen_url && (
                <img
                  src={clase.imagen_url}
                  alt={`Imagen de ${clase.nombre}`}
                  className="imagen-clase"
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '10px' }}
                />
              )}
              <h3>{clase.nombre}</h3>
              <p><strong>Categoría:</strong> {clase.categoria_nombre}</p>
              <p><strong>Descripción:</strong> {clase.descripcion}</p>
              <p><strong>Cupo máximo:</strong> {clase.cupo_maximo}</p>
              <Link to={`/clases/${clase.id}`} className="btn-detalle">Ver detalles</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoriaDetalle;