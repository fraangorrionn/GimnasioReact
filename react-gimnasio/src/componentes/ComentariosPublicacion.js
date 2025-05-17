import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ComentariosPublicacion.css';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

function ComentariosPublicacion({ publicacionId }) {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const token = localStorage.getItem('access_token');

  const obtenerComentarios = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/comentarios/${publicacionId}/`);
      setComentarios(res.data);
    } catch (err) {
      console.error('Error al obtener comentarios', err);
    }
  };

  const publicarComentario = async () => {
    if (!nuevoComentario.trim()) return;
    try {
      await axios.post('http://localhost:8000/api/comentarios/crear/', {
        publicacion: publicacionId,
        contenido: nuevoComentario
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNuevoComentario('');
      obtenerComentarios();
    } catch (err) {
      console.error('Error al comentar', err);
    }
  };

  const manejarLike = async (comentarioId, tipo) => {
    try {
      await axios.post(`http://localhost:8000/api/comentarios/${comentarioId}/like_dislike_comentario/`, {
        tipo: tipo
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      obtenerComentarios();
    } catch (err) {
      console.error('Error al reaccionar', err);
    }
  };

  useEffect(() => {
    obtenerComentarios();
  }, [publicacionId]);

  return (
    <div className="comentarios-container">
      <h4>Comentarios</h4>

      <div className="form-comentario">
        <textarea
          value={nuevoComentario}
          onChange={e => setNuevoComentario(e.target.value)}
          placeholder="Escribe un comentario..."
        ></textarea>
        <button onClick={publicarComentario}>Comentar</button>
      </div>

      <div className="lista-comentarios">
        {comentarios.map(com => (
          <div key={com.id} className="comentario">
            <strong>{com.usuario_data?.username}</strong>
            <p>{com.contenido}</p>
            <div className="reacciones">
            <button className="btn-like" onClick={() => manejarLike(com.id, 'like')}>
              <ThumbsUp size={18} /> {com.likes}
            </button>

            <button className="btn-dislike" onClick={() => manejarLike(com.id, 'dislike')}>
              <ThumbsDown size={18} /> {com.dislikes}
            </button>

              <span className="fecha">{new Date(com.fecha_comentario).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComentariosPublicacion;