// src/paginas/InicioPagina.js
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import img1 from '../assets/carrusel1.png';
import img2 from '../assets/carrusel2.png';
import img3 from '../assets/carrusel3.png';
import img4 from '../assets/carrusel4.png';
import img5 from '../assets/carrusel5.png';
import img6 from '../assets/carrusel6.png';

const API_URL = process.env.REACT_APP_API_URL;
const images = [img1, img2, img3, img4, img5, img6];

function InicioPagina() {
  const [clases, setClases] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/clases/`)
      .then(res => setClases(res.data))
      .catch(err => console.error('Error cargando clases', err));
  }, []);

  return (
    <div className="inicio-container">
      <div className="swiper-container">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          className="swiper"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <img src={src} alt={`carrusel-${index}`} className="carrusel-img" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <h2 className="clases-titulo">Clases Disponibles</h2>
      <div className="tarjetas-clases">
        {clases.map(clase => (
          <div key={clase.id} className="tarjeta-clase">
            <h3>{clase.nombre}</h3>
            <p><strong>Categoría:</strong> {clase.categoria_nombre}</p>
            <p><strong>Descripción:</strong> {clase.descripcion}</p>
            <p><strong>Cupo máximo:</strong> {clase.cupo_maximo}</p>
            <Link to={`/clases/${clase.id}`} className="btn-detalle">Ver detalles</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InicioPagina;
