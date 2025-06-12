import React from 'react';
import { Link } from 'react-router-dom';
import './PanelCategorias.css';

export default function PanelCategorias({ visible, onClose, categorias = [] }) {
  if (!visible) return null;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel-categorias" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h3>Categorías</h3>
          <button className="cerrar-btn" onClick={onClose}>✕</button>
        </div>
        <ul>
        <div className="panel-footer-line"></div>
          {categorias.map(cat => (
            <li key={cat.id}>
              <Link to={`/categorias/${cat.slug}`} onClick={onClose}>
                {cat.imagen_url && (
                  <img
                    src={cat.imagen_url}
                    alt={cat.nombre}
                    className="categoria-img"
                  />
                )}
                <span>{cat.nombre}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}