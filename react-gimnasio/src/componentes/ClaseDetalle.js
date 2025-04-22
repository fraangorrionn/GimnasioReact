import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ClaseDetalle.css';

const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const HORAS = Array.from({ length: 16 }, (_, i) => `${7 + i}:00`);

function ClaseDetalle() {
  const { id } = useParams();
  const [horarios, setHorarios] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [mostrarFormPublicacion, setMostrarFormPublicacion] = useState(false);
  const [formularioPublicacion, setFormularioPublicacion] = useState({
    clase: id,
    titulo: '',
    contenido: '',
    imagen: null
  });
  const [editandoPublicacionId, setEditandoPublicacionId] = useState(null);
  const [celdaActiva, setCeldaActiva] = useState(null);
  const [inscrito, setInscrito] = useState(null);
  const [puedeInscribirse, setPuedeInscribirse] = useState(false);

  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const token = localStorage.getItem('access_token');
  const esMonitor = usuario.rol === 'monitor' || usuario.rol === 'admin';
  const esCliente = usuario.rol === 'cliente';

  const obtenerHorarios = useCallback(async () => {
    const res = await axios.get('http://localhost:8000/api/horarios/');
    const filtrados = res.data.filter(h => h.clase === parseInt(id));
    setHorarios(filtrados);
  }, [id]);

  const obtenerPublicaciones = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/publicaciones/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const filtradas = res.data.filter(p => p.clase === parseInt(id));
      setPublicaciones(filtradas);
    } catch (err) {
      console.error(err);
    }
  }, [id, token]);

  const obtenerInscripcion = useCallback(() => {
    if (esCliente && token) {
      axios.get('http://localhost:8000/api/inscripciones/', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        const actual = res.data.find(i => i.usuario === usuario.id && i.clase === parseInt(id));
        setInscrito(actual || null);
      }).catch(err => console.error(err));
    }
  }, [esCliente, token, usuario.id, id]);

  const verificarSuscripcionYPago = useCallback(() => {
    if (!esCliente || !token) return;

    axios.get('http://localhost:8000/api/suscripciones/', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const activas = res.data.filter(s => s.usuario === usuario.id && s.estado === 'activa');
      if (activas.length > 0) {
        const suscripcionId = activas[0].id;
        axios.get('http://localhost:8000/api/pagos/', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(pagosRes => {
          const tienePago = pagosRes.data.some(p => p.suscripcion === suscripcionId && p.estado === 'completado');
          setPuedeInscribirse(tienePago);
        });
      }
    }).catch(err => console.error(err));
  }, [esCliente, token, usuario.id]);

  useEffect(() => {
    obtenerHorarios();
    obtenerPublicaciones();
    obtenerInscripcion();
    verificarSuscripcionYPago();
  }, [obtenerHorarios, obtenerPublicaciones, obtenerInscripcion, verificarSuscripcionYPago]);

  const gestionarInscripcion = async () => {
    try {
      if (inscrito) {
        await axios.delete(`http://localhost:8000/api/inscripciones/eliminar/${inscrito.id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInscrito(null);
      } else {
        await axios.post('http://localhost:8000/api/inscripciones/crear/', {
          usuario: usuario.id,
          clase: parseInt(id),
          estado: 'activa'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        obtenerInscripcion();
      }
    } catch (err) {
      console.error(err);
      alert('Error al gestionar inscripción');
    }
  };

  const handleClickCelda = (dia, hora) => {
    if (!esMonitor) return;
    setCeldaActiva({ dia, hora });
  };

  const handleAgregarClase = async () => {
    const { dia, hora } = celdaActiva;
    await axios.post('http://localhost:8000/api/horarios/crear/', {
      clase: id,
      dia_semana: dia,
      hora_inicio: `${hora.padStart(2, '0')}:00`,
      hora_fin: `${parseInt(hora) + 1}:00`,
    });
    setCeldaActiva(null);
    obtenerHorarios();
  };

  const handleEliminarClase = async () => {
    const { dia, hora } = celdaActiva;
    const horario = horarios.find(h =>
      h.dia_semana === dia && h.hora_inicio === `${hora.padStart(2, '0')}:00:00`
    );
    if (horario) {
      await axios.delete(`http://localhost:8000/api/horarios/eliminar/${horario.id}/`);
      setCeldaActiva(null);
      obtenerHorarios();
    }
  };

  const handleChangePublicacion = e => {
    const { name, value, files } = e.target;
    setFormularioPublicacion({
      ...formularioPublicacion,
      [name]: files ? files[0] : value
    });
  };

  const crearOActualizarPublicacion = async () => {
    const formData = new FormData();
    formData.append('clase', formularioPublicacion.clase);
    formData.append('titulo', formularioPublicacion.titulo);
    formData.append('contenido', formularioPublicacion.contenido);
    if (formularioPublicacion.imagen) {
      formData.append('imagen', formularioPublicacion.imagen);
    }

    try {
      if (editandoPublicacionId) {
        await axios.put(`http://localhost:8000/api/publicaciones/editar/${editandoPublicacionId}/`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post('http://localhost:8000/api/publicaciones/crear/', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      }

      setMostrarFormPublicacion(false);
      setFormularioPublicacion({ clase: id, titulo: '', contenido: '', imagen: null });
      setEditandoPublicacionId(null);
      obtenerPublicaciones();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditarPublicacion = (publicacion) => {
    setFormularioPublicacion({
      clase: publicacion.clase,
      titulo: publicacion.titulo,
      contenido: publicacion.contenido,
      imagen: null
    });
    setEditandoPublicacionId(publicacion.id);
    setMostrarFormPublicacion(true);
  };

  const handleEliminarPublicacion = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/publicaciones/eliminar/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      obtenerPublicaciones();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="clase-detalle">
      <h2>Clase #{id}</h2>

      {esCliente && puedeInscribirse && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button onClick={gestionarInscripcion} className="btn-crear">
            {inscrito ? 'Cancelar inscripción' : 'Inscribirse a esta clase'}
          </button>
        </div>
      )}

      {esCliente && !puedeInscribirse && (
        <div style={{ textAlign: 'center', color: 'tomato', marginBottom: '1rem' }}>
          Necesitas una suscripción activa con un pago completado para inscribirte.
        </div>
      )}

      <section className="horario-clase">
        <h3>Horario</h3>
        <table className="tabla-horarios">
          <thead>
            <tr>
              <th>Hora</th>
              {DIAS.map(dia => <th key={dia}>{dia}</th>)}
            </tr>
          </thead>
          <tbody>
            {HORAS.map(hora => (
              <tr key={hora}>
                <td>{hora}</td>
                {DIAS.map(dia => {
                  const horario = horarios.find(h =>
                    h.dia_semana === dia && h.hora_inicio === `${hora.padStart(2, '0')}:00:00`
                  );
                  const esActiva = celdaActiva && celdaActiva.dia === dia && celdaActiva.hora === hora;
                  return (
                    <td
                      key={`${dia}-${hora}`}
                      className={horario ? 'ocupado' : 'libre'}
                      onClick={() => handleClickCelda(dia, hora)}
                      title={horario?.clase_nombre || 'Haz clic para modificar'}
                    >
                      {horario ? horario.clase_nombre : (esMonitor ? '+' : '')}
                      {esActiva && esMonitor && (
                        <div className="celda-horario-opciones">
                          {horario ? (
                            <button onClick={handleEliminarClase}>Quitar clase</button>
                          ) : (
                            <button onClick={handleAgregarClase}>Añadir clase</button>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="publicaciones-clase">
        <h3>Publicaciones</h3>

        {esMonitor && (
          <>
            <button onClick={() => {
              setMostrarFormPublicacion(!mostrarFormPublicacion);
              setFormularioPublicacion({ clase: id, titulo: '', contenido: '', imagen: null });
              setEditandoPublicacionId(null);
            }}>
              {mostrarFormPublicacion
                ? 'Cancelar'
                : editandoPublicacionId ? 'Editar publicación' : 'Nueva publicación'}
            </button>

            {mostrarFormPublicacion && (
              <div className="form-publicacion">
                <input
                  type="text"
                  name="titulo"
                  placeholder="Título"
                  value={formularioPublicacion.titulo}
                  onChange={handleChangePublicacion}
                />
                <textarea
                  name="contenido"
                  placeholder="Contenido"
                  value={formularioPublicacion.contenido}
                  onChange={handleChangePublicacion}
                />
                <input
                  type="file"
                  name="imagen"
                  accept="image/*"
                  onChange={handleChangePublicacion}
                />
                <button onClick={crearOActualizarPublicacion}>
                  {editandoPublicacionId ? 'Guardar cambios' : 'Publicar'}
                </button>
              </div>
            )}
          </>
        )}

        {(esMonitor || inscrito) && (
          <div className="lista-publicaciones">
            {publicaciones.map(p => (
              <div key={p.id} className="publicacion">
                {esMonitor && (
                  <div className="acciones">
                    <button onClick={() => handleEditarPublicacion(p)}>Editar</button>
                    <button onClick={() => handleEliminarPublicacion(p.id)}>Eliminar</button>
                  </div>
                )}
                <h4>{p.titulo}</h4>
                <p>{p.contenido}</p>
                {p.imagen && <img src={`http://localhost:8000${p.imagen}`} alt="Publicación" />}
                <p className="fecha">{p.fecha_publicacion}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ClaseDetalle;
