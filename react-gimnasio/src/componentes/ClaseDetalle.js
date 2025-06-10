// ClaseDetalle.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClaseDetalle.css';
import ComentariosPublicacion from './ComentariosPublicacion';

const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const HORAS = Array.from({ length: 16 }, (_, i) => `${7 + i}:00`);
const API_URL = process.env.REACT_APP_API_URL;

function ClaseDetalle() {
  const { id } = useParams();
  const location = useLocation();
  const suscripcionActivada = location.state?.suscripcion_activada || false;
  const navigate = useNavigate();

  const [horarios, setHorarios] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [reservasPorHorario, setReservasPorHorario] = useState({});
  const [horariosReservados, setHorariosReservados] = useState(new Set());
  const [claseInfo, setClaseInfo] = useState(null);
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
  const esCreador = claseInfo && claseInfo.usuario === usuario.id;

  
  const obtenerClaseInfo = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/clases/${id}/`);
      setClaseInfo(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  
  const obtenerReservas = useCallback(async () => {
    try {
      const datos = {};
      const reservasUsuario = new Set();

      await Promise.all(horarios.map(async (h) => {
        const res = await axios.get(`${API_URL}/api/reservas/${h.id}/contador/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        datos[h.id] = res.data.reservas;

        const yaReservado = await axios.get(`${API_URL}/api/reservas/${h.id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null);

        if (yaReservado?.data?.reservado) {
          reservasUsuario.add(h.id);
        }
      }));

      setReservasPorHorario(datos);
      setHorariosReservados(reservasUsuario);
    } catch (err) {
      console.error('Error al obtener reservas:', err);
    }
  }, [horarios, token]);

  const obtenerHorarios = useCallback(async () => {
    const res = await axios.get(`${API_URL}/api/horarios/`);
    const filtrados = res.data.filter(h => h.clase === parseInt(id));
    setHorarios(filtrados);
  }, [id]);

  const obtenerPublicaciones = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/publicaciones/`, {
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
      axios.get(`${API_URL}/api/inscripciones/`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        const actual = res.data.find(i => i.usuario === usuario.id && i.clase === parseInt(id));
        setInscrito(actual || null);
      }).catch(err => console.error(err));
    }
  }, [esCliente, token, usuario.id, id]);

  const verificarSuscripcionYPago = useCallback(() => {
    if (!esCliente || !token) return;

    axios.get(`${API_URL}/api/suscripciones/`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const activas = res.data.filter(s => s.usuario === usuario.id && s.estado === 'activa');
      if (activas.length > 0) {
        const suscripcionId = activas[0].id;
        axios.get(`${API_URL}/api/pagos/`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(pagosRes => {
          const tienePago = pagosRes.data.some(p => p.suscripcion === suscripcionId && p.estado === 'completado');
          setPuedeInscribirse(tienePago);
        });
      }
    }).catch(err => console.error(err));
  }, [esCliente, token, usuario.id]);

  useEffect(() => {
    obtenerClaseInfo();
    obtenerHorarios();
    obtenerPublicaciones();
    obtenerInscripcion();
    verificarSuscripcionYPago();
  },
  [obtenerHorarios, obtenerPublicaciones, obtenerInscripcion, verificarSuscripcionYPago, suscripcionActivada]);

  useEffect(() => {
    if (inscrito) {
      obtenerReservas();
    }
  }, [horarios, inscrito, obtenerReservas]);

  const gestionarInscripcion = async () => {
    try {
      if (inscrito) {
        await axios.delete(`${API_URL}/api/inscripciones/eliminar/${inscrito.id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInscrito(null);
      } else {
        await axios.post(`${API_URL}/api/inscripciones/crear/`, {
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
    setCeldaActiva({ dia, hora: hora.padStart(5, '0') });
  };

  const handleAgregarClase = async () => {
    const { dia, hora } = celdaActiva;

    try {
      await axios.post(`${API_URL}/api/horarios/crear/`, {
        clase: id,
        dia_semana: dia,
        hora_inicio: `${hora.padStart(2, '0')}:00`,
        hora_fin: `${parseInt(hora) + 1}:00`,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCeldaActiva(null);
      obtenerHorarios();
    } catch (error) {
      console.error("Error al agregar horario:", error);
      alert("No se pudo crear el horario. ¿Estás autenticado como monitor?");
    }
  };

  const handleEliminarClase = async () => {
    const { dia, hora } = celdaActiva;
    const horario = horarios.find(h =>
      h.dia_semana === dia && h.hora_inicio.startsWith(`${hora.padStart(2, '0')}:`)
    );

    if (horario) {
      try {
        await axios.delete(`${API_URL}/api/horarios/eliminar/${horario.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCeldaActiva(null);
        obtenerHorarios();
      } catch (error) {
        console.error("Error al eliminar horario:", error);
        alert("No se pudo eliminar el horario. ¿Estás autenticado como monitor?");
      }
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
        await axios.put(`${API_URL}/api/publicaciones/editar/${editandoPublicacionId}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post(`${API_URL}/api/publicaciones/crear/`, formData, {
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
      await axios.delete(`${API_URL}/api/publicaciones/eliminar/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      obtenerPublicaciones();
    } catch (err) {
      console.error(err);
    }
  };

  const normalizarHora = h => h.slice(0, 5);

  const reservarHorario = async (horarioId) => {
    try {
      await axios.post(`${API_URL}/api/reservas/${horarioId}/crear/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      obtenerReservas();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al reservar');
    }
  };

  const cancelarReserva = async (horarioId) => {
    try {
      await axios.delete(`${API_URL}/api/reservas/${horarioId}/cancelar/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      obtenerReservas();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cancelar');
    }
  };


  return (
    <div className="clase-detalle">
      <h2>Clase #{id}</h2>
      {usuario.rol === 'monitor' && claseInfo && claseInfo.usuario !== usuario.id && (
        <div style={{ textAlign: 'center', color: 'tomato', fontWeight: 'bold', marginBottom: '1rem' }}>
          No eres monitor en esta clase. No puedes trabajar en ella.
        </div>
      )}

      {esCliente && puedeInscribirse && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button onClick={gestionarInscripcion} className="btn-crear">
            {inscrito ? 'Cancelar inscripción' : 'Inscribirse a esta clase'}
          </button>
        </div>
      )}

      {esCliente && !puedeInscribirse && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <p style={{ color: 'tomato' }}>
            Necesitas una suscripción activa con un pago completado para inscribirte.
          </p>
          <button
            className="btn-crear"
            onClick={() => {
              localStorage.setItem('clase_pago', id);
              navigate('/pago');
            }}
          >
            Suscribirse
          </button>
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
                    h.dia_semana === dia && normalizarHora(h.hora_inicio) === hora.padStart(5, '0')
                  );
                  const esActiva = celdaActiva && celdaActiva.dia === dia && celdaActiva.hora === hora.padStart(5, '0');

                  return (
                    <td
                      key={`${dia}-${hora}`}
                      className={horario ? 'ocupado' : 'libre'}
                      onClick={() => handleClickCelda(dia, hora)}
                      title={horario?.clase_nombre || 'Haz clic para modificar'}
                    >
                      {horario ? horario.clase_nombre : (esCreador ? '+' : '')}

                      {esCliente && inscrito && horario && (
  <div className="reserva-info">
    <div className="contador-reservas">
      {reservasPorHorario[horario.id] || 0} / {claseInfo?.cupo_maximo} reservados
    </div>
    {horariosReservados.has(horario.id) ? (
      <button onClick={(e) => { e.stopPropagation(); cancelarReserva(horario.id); }}>
        Cancelar reserva
      </button>
    ) : (
      reservasPorHorario[horario.id] < claseInfo?.cupo_maximo && (
        <button onClick={(e) => { e.stopPropagation(); reservarHorario(horario.id); }}>
          Reservar
        </button>
      )
    )}
  </div>
)}

                      {esActiva && esCreador && (
                        <div className="celda-horario-opciones">
                          {horario ? (
                            <button onClick={(e) => {
                              e.stopPropagation();
                              handleEliminarClase();
                            }}>Quitar clase</button>
                          ) : (
                            <button onClick={(e) => {
                              e.stopPropagation();
                              handleAgregarClase();
                            }}>Añadir clase</button>
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

        {esCreador && (
          <>
            <button
              className="btn-nueva-publicacion"
              onClick={() => {
                setMostrarFormPublicacion(!mostrarFormPublicacion);
                setFormularioPublicacion({ clase: id, titulo: '', contenido: '', imagen: null });
                setEditandoPublicacionId(null);
              }}
            >
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
                {esCreador && (
                  <div className="acciones">
                    <button onClick={() => handleEditarPublicacion(p)}>Editar</button>
                    <button onClick={() => handleEliminarPublicacion(p.id)}>Eliminar</button>
                  </div>
                )}
                <h4>{p.titulo}</h4>
                <p>{p.contenido}</p>
                {p.imagen && <img src={p.imagen} alt="Publicación" />}
                <p className="fecha">{p.fecha_publicacion}</p>
                <ComentariosPublicacion publicacionId={p.id} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


export default ClaseDetalle;