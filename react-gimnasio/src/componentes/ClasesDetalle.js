import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ClaseDetalle.css';

function ClaseDetalle() {
  const { claseId } = useParams();
  const [horarios, setHorarios] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/horarios/?clase=${claseId}`)
      .then(res => setHorarios(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:8000/api/clases/${claseId}/imagenes/`)
      .then(res => setImagenes(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:8000/api/publicaciones/?clase=${claseId}`)
      .then(res => setPublicaciones(res.data))
      .catch(err => console.error(err));
  }, [claseId]);

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const horas = Array.from({ length: 16 }, (_, i) => `${(7 + i).toString().padStart(2, '0')}:00`);

  const hayClase = (dia, hora) => {
    return horarios.some(h =>
      h.dia_semana === dia &&
      h.hora_inicio.slice(0, 5) <= hora &&
      h.hora_fin.slice(0, 5) > hora
    );
  };

  return (
    <div className="clase-detalle">
      <h2>Horario</h2>
      <div className="tabla-horario">
        <table>
          <thead>
            <tr>
              <th>Hora</th>
              {diasSemana.map((dia, i) => (
                <th key={i}>{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horas.map((hora, i) => (
              <tr key={i}>
                <td>{hora}</td>
                {diasSemana.map((dia, j) => (
                  <td key={j}>{hayClase(dia, hora) ? '✅' : ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Galería</h2>
      <div className="carrusel-imagenes">
        {/* Aquí irá el carrusel */}
      </div>

      <h2>Publicaciones</h2>
      <div className="seccion-publicaciones">
        {/* Aquí irán las publicaciones y comentarios */}
      </div>
    </div>
  );
}

export default ClaseDetalle;
