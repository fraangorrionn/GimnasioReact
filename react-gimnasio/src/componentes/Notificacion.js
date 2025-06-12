import React from 'react';
import './Notificacion.css';
import { CheckCircle, XCircle } from 'lucide-react';

const Notificacion = ({ mensaje, tipo = 'info', visible, onClose }) => {
  if (!visible) return null;

  const icono = tipo === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />;

  return (
    <div className={`notificacion ${tipo}`}>
      <div className="contenido">
        {icono}
        <span>{mensaje}</span>
      </div>
    </div>
  );
};

export default Notificacion;
